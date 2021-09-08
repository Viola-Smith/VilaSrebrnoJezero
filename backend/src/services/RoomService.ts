import RoomRepo from '../database/repositories/RoomRepo'


export default class RoomService {

    public static async getAllRooms() {
        return await RoomRepo.getAllRooms()
    }

    public static async getAvailableRooms(date1: any, date2: any, adults: any, kids: any, rooms:any) {
        return await RoomRepo.getAvailableRooms(date1, date2, adults, kids, rooms)
    }

}