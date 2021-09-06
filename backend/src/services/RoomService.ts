import RoomRepo from '../database/repositories/RoomRepo'


export default class RoomService {

    public static async getAllRooms() {
        return await RoomRepo.getAllRooms()
    }

}