import Room from '../models/room';

export default class RoomRepo {

    public static async getAllRooms() {
        return await Room.collection.find().toArray()
    }

    public static async getRoomById(id: number) {
        return await Room.findOne({ id: id }).exec()
    }

}