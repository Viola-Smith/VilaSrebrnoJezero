import Room from '../models/room';
import Repo from './Repo';

export default class RoomRepo extends Repo {
    constructor() {
        super(Room)
    }

    public async getRoomsByType(name: string) {
        return await this.model.find({ '$and': [{name: name}, {'bookable' : true}] }).exec()
    }

    public async getAvailableRoom(finalRoomIds: any[], takenRoomIds: any[], adultsNum: number) {
        return await this.model.findOne(
            {
                '$and': [
                    { 'id': { $nin: finalRoomIds } },
                    { 'id': { $nin: takenRoomIds } },
                    { 'adults': adultsNum },
                    { 'bookable': true }
                ],
            }
        ).exec()
    }

}