import { Document } from 'bson';
import RoomRepo from '../database/repositories/RoomRepo'
import ReservationService from './ReservationService';
import PricelistService from "./PricelistService";


export default class RoomService {

    public static async getAllRooms() {
        return await RoomRepo.getAllRooms()
    }

    public static async getAllRoomsByType(type: string) {
        return await RoomRepo.getRoomsByType(type)
    }

    private static async getAvailable(dateFrom: any, dateTo: any, adults: string, numRooms: string) {
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
                room = await RoomRepo.getAvailableRoom(finalRooms.map(r => r.id), takenRooms.map(r => r.id), adultsArray[i])

                if (room) {
                    reservations = await ReservationService.checkAvailable(dateFrom, dateTo, room.id)
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

    public static async getAvailableRooms(date1: any, date2: any, adults: any, roomsNum: any) {
        let rooms = await RoomService.getAvailable(date1, date2, adults, roomsNum)
        let finalRooms = []
        for (let index = 0; index < rooms.length; index++) {
            let room = rooms[index]
            let foundRoom = finalRooms.find(r => r.type === room.name)

            if (foundRoom) {
                foundRoom.rooms.push(room)
                foundRoom.amount++
            } else {
                finalRooms.push({ rooms: [room], amount: 1, type: room.name, price: await PricelistService.calculatePrice(date1, date2, room.name) })
            }
        }
        return finalRooms
    }

    public static async getAllAvailableRooms(date1: any, date2: any) {
        let allRooms = await this.getAllRooms()
        let finalRooms: Document[] = []
        for (let index = 0; index < allRooms.length; index++) {
            let room = allRooms[index]

            if (room.bookable && RoomService.checkRoomBookable(room, date1, date2)) {
                const reservations = await ReservationService.checkAvailable(date1, date2, room.id)
                if (reservations.length === 0) {
                    let foundRoom = finalRooms.find(r => r.type === room.name)

                    if (foundRoom) {
                        foundRoom.rooms.push(room)
                        foundRoom.amount++
                    } else {
                        finalRooms.push({ rooms: [room], amount: 1, type: room.name, price: await PricelistService.calculatePrice(date1, date2, room.name) })
                    }
                }
            }

        }

        return finalRooms
    }

    private static checkRoomBookable(room: any, date1: string, date2: string) {
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

    public static async updateRoom (roomId: any, room:any) {
        console.log(roomId)
        console.log(room)
        let updated = await RoomRepo.update(roomId, room)
        console.log(updated)
        if (updated.modifiedCount > 0) {
            return { 'message': 'Sucessfully edited room' } 
        } else {
            return { 'message': 'Failed to edit room' } 
        }
    }

}