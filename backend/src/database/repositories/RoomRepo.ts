import Room from '../models/room';
import Repo from './Repo';

export default class RoomRepo extends Repo {
    constructor() {
        super(Room)
    }

    public async getRoomsByType(name: string) {
        return await this.model.find({ name: name }).exec()
    }

    public async getAvailableRoom(finalRoomIds: any[], takenRoomIds: any[], adultsNum: number) {
        return await this.model.findOne(
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

}