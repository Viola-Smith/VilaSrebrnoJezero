import Room from '../models/room';
import ReservationRepo from './ReservationRepo';

export default class RoomRepo {

    public static async getAllRooms() {
        return await Room.collection.find().toArray()
    }

    public static async getRoomById(id: number) {
        return await Room.findOne({ id: id }).exec()
    }

    public static async getAvailableRooms(dateFrom: any, dateTo: any, adults: any, kids: any, numRooms: any) {
        let adultsNum = parseFloat(adults)
        let kidsNum = parseFloat(kids)
        let roomsNum = parseFloat(numRooms)

        let adultsPerRoom = Math.ceil(adultsNum / roomsNum)
        let kidsPerRoom = Math.ceil(kidsNum / roomsNum)
        let total = adultsPerRoom + kidsPerRoom

        let adultsArray = []

        while (adultsNum > 0 && roomsNum > 0) {
            var a = Math.floor(adultsNum / roomsNum);
            adultsNum -= a;
            roomsNum--;
            adultsArray.push(a);
        }

        let finalRooms = []
        let roomExistIds: Number[] = []
            
        //let roomsToReturn = []
        for (let i = 0; i < adultsArray.length; i++) {
            let roomExists = undefined
            let room: any = null
            if (adultsArray[i] == 1) adultsArray[i] = 2
            do {
                room = await Room.findOne(
                    {
                        '$and': [{ 'id': { $nin: roomExistIds } }, {
                            '$or':
                                [
                                    { 'adults': total },
                                    {
                                        '$and':
                                            [{ 'adults': adultsArray[i] },
                                            { 'extra_beds': { $gte: kidsPerRoom } }]
                                    }
                                ]
                        }],
                    }
                ).exec()
                roomExists = finalRooms.find(r => r.id === room.id)

            } while (roomExists && room)

            if (room) {
                const reservations = await ReservationRepo.checkAvailable(dateFrom, dateTo, room.id)
                if (reservations.length === 0) {
                    finalRooms.push(room)
                    roomExistIds.push(room.id)
                }
            }
            console.log(roomExistIds)
            // for (let index = 0; index < rooms.length; index++) {
            //     const room = rooms[index]
            //     // let roomExists = roomsToReturn.find(r => r.find(ro => ro.id === room.id))
            //     // console.log(roomExists)
            //     // if (roomExists !== undefined) break;
            //     const reservations = await ReservationRepo.checkAvailable(dateFrom, dateTo, room.id)
            //     if (reservations.length === 0) finalRooms.push(room)
            // }
            //roomsToReturn.push(finalRooms)
        }

        return finalRooms
    }

}