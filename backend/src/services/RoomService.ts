import { Document } from 'bson';
import RoomRepo from '../database/repositories/RoomRepo'
import ReservationService from './ReservationService';
import PricelistService from "./PricelistService";


export default class RoomService {

    public static async getAllRooms() {
        return await RoomRepo.getAllRooms()
    }

    public static async getAvailableRooms(date1: any, date2: any, adults: any, kids: any, roomsNum:any) {
        let rooms = await RoomRepo.getAvailableRooms(date1, date2, adults, kids, roomsNum)
        let finalRooms = []
        for (let index = 0; index < rooms.length; index++) {
            let room = rooms[index]
            let foundRoom = finalRooms.find(r => r.type === room.name)
        
            if (foundRoom) {
                foundRoom.rooms.push(room)
                foundRoom.amount++
            } else {
                finalRooms.push({rooms: [room], amount:1, type: room.name, price: await PricelistService.calculatePrice(date1, date2, room.name)})
            }  
        }
        return finalRooms
    }

    public static async getAllAvailableRooms(date1: any, date2: any) {
        let allRooms =  await this.getAllRooms()
        let finalRooms: Document[] = []
        for (let index = 0; index < allRooms.length; index++) {
            let room = allRooms[index]
            const reservations = await ReservationService.checkAvailable(date1, date2, room.id)
            if (reservations.length === 0) {
                let foundRoom = finalRooms.find(r => r.type === room.name)
                
                if (foundRoom) {
                    foundRoom.rooms.push(room)
                    foundRoom.amount++
                } else {
                    finalRooms.push({rooms: [room], amount:1, type: room.name, price: await PricelistService.calculatePrice(date1, date2, room.name)})
                }
            }
            
        }
       
        return finalRooms
    }

    

}