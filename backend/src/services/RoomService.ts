import RoomRepo from '../database/repositories/RoomRepo'
import PricelistService from "./PricelistService";
import Service from "./Service"
import { Document } from 'bson';
import ReservationRepo from '../database/repositories/ReservationRepo';

export default class RoomService extends Service {
    protected repo = new RoomRepo()
    private resRepo = new ReservationRepo()
    private priceService = new PricelistService()
    protected name = 'room'


    public async getAllRoomsByType(type: string) {
        return await this.repo.getRoomsByType(type)
    }

    private checkRoomBookable(room: any, date1: string, date2: string) {
        for (let b of room.bookable_periods) {
            let start_date = new Date(date1.split('-')[0] + '-' + b.start_date)
            let end_date = new Date(date2.split('-')[0] + '-' + b.end_date)
            let date_end2 = new Date(end_date)
            let date_start2 = new Date(start_date)

            if (start_date > end_date) {
                let year = date2.split('-')[0]
                date_start2 = new Date(parseInt(year) - 1 + '-' + start_date)
                date_end2 = new Date(parseInt(year) + 1 + '-' + end_date)
            }
        
            if (((new Date(date1)) >= start_date && new Date(date2) <= date_end2) ||
                ((new Date(date1)) >= date_start2 && new Date(date2) <= end_date)) {
                return true
            }
        }
        return false
    }

    private async getAvailable(dateFrom: any, dateTo: any, adults: string, numRooms: string) {
        let adultsNum = parseFloat(adults)
        let roomsNum = parseFloat(numRooms)

        let adultsArray = []

        while (adultsNum > 0 && roomsNum > 0) {
            var a = Math.floor(adultsNum / roomsNum);
            adultsNum -= a;
            roomsNum--;
            adultsArray.push(a);
        }

        let finalRooms = []
        let takenRooms = []

        console.log(adultsArray)
        for (let i = 0; i < adultsArray.length; i++) {
            let room: any = null
            if (adultsArray[i] == 1) adultsArray[i] = 2

            let reservations = []
            let isBookable = false

            do {
                room = await this.repo.getAvailableRoom(finalRooms.map(r => r.id), takenRooms.map(r => r.id), adultsArray[i])

                if (room) {
                    reservations = await this.resRepo.checkAvailable(dateFrom, dateTo, room.id)
                    isBookable = this.checkRoomBookable(room, dateFrom, dateTo)
                
                    if (reservations.length === 0 && isBookable) {
                        finalRooms.push(room)
                    } else {
                        takenRooms.push(room)
                    }
                }

            } while (finalRooms.length < adultsArray.length && room)

        }

        return finalRooms
    }

    public async getAvailableRooms(date1: any, date2: any, adults: any, roomsNum: any) {
        let rooms = await this.getAvailable(date1, date2, adults, roomsNum)
        let finalRooms = []
        for (let index = 0; index < rooms.length; index++) {
            let room = rooms[index]
            let foundRoom = finalRooms.find(r => r.type === room.name)

            if (foundRoom) {
                foundRoom.rooms.push(room)
                foundRoom.amount++
            } else {
                finalRooms.push({ rooms: [room], amount: 1, type: room.name, price: await this.priceService.calculatePrice(date1, date2, room.name) })
            }
        }
        return finalRooms
    }

    public async getAllAvailableRooms(date1: any, date2: any) {
        let allRooms = await this.getAll()
        let finalRooms: Document[] = []
        for (let index = 0; index < allRooms.length; index++) {
            let room = allRooms[index]

            if (room.bookable && this.checkRoomBookable(room, date1, date2)) {
                const reservations = await this.resRepo.checkAvailable(date1, date2, room.id)
                if (reservations.length === 0) {
                    let foundRoom = finalRooms.find(r => r.type === room.name)

                    if (foundRoom) {
                        foundRoom.rooms.push(room)
                        foundRoom.amount++
                    } else {
                        finalRooms.push({ rooms: [room], amount: 1, type: room.name, price: await this.priceService.calculatePrice(date1, date2, room.name) })
                    }
                }
            }

        }

        return finalRooms
    }

}