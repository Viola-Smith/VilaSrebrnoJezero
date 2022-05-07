import Room from '../models/room';
import ReservationRepo from './ReservationRepo';

export default class RoomRepo {

    public static async getAllRooms() {
        return await Room.collection.find().toArray()
    }

    public static async getRoomById(id: number) {
        return await Room.findOne({ id: id }).exec()
    }

    public static async getRoomsByType(name: string) {
        return await Room.find({ name: name }).exec()
    }

    public static async getAvailableRoom(finalRoomIds: any[], takenRoomIds: any[], adultsNum: number) {
        return await Room.findOne(
            {
                '$and': [
                    { 'id': { $nin: finalRoomIds } },
                    { 'id': { $nin: takenRoomIds } },
                    {
                        '$or':
                            [
                                { 'adults': adultsNum }

                            ]
                    },
                    { 'bookable': true }
                ],
            }
        ).exec()

    }

    public static async update(roomId: number, room: any) {
        return await Room.updateOne( { id: roomId }, room ).exec()
    }

}