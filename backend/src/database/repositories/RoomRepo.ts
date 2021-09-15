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

    public static async getAvailableRooms(dateFrom: any, dateTo: any, adults: any, kids: any, numRooms: any) {
        let adultsNum = parseFloat(adults)
        let kidsNum = parseFloat(kids)
        let roomsNum = parseFloat(numRooms)

        // let adultsPerRoom = Math.ceil(adultsNum / roomsNum)
        // let kidsPerRoom = Math.ceil(kidsNum / roomsNum)
        // let total = adultsPerRoom + kidsPerRoom

        let adultsArray = []

        while (adultsNum > 0 && roomsNum > 0) {
            var a = Math.floor(adultsNum / roomsNum);
            adultsNum -= a;
            roomsNum--;
            adultsArray.push(a);
        }

        let finalRooms = []
        let takenRooms = []
        //let roomsToReturn = []
        console.log(adultsArray)
        for (let i = 0; i < adultsArray.length; i++) {
            let roomExists = undefined
            let room: any = null
            if (adultsArray[i] == 1) adultsArray[i] = 2

            let reservations = []
            do {
                room = await Room.findOne(
                    {
                        '$and': [{ 'id': { $nin: finalRooms.map(r => r.id) } }, { 'id': { $nin: takenRooms.map(r => r.id) } }, {
                            '$or':
                                [
                                    { 'adults': adultsArray[i] }
                                    // {
                                    //     '$and':
                                    //         [{ 'adults': adultsArray[i] },
                                    //         { 'extra_beds': { $gte: kidsPerRoom } }]
                                    // }
                                ]
                        }],
                    }
                ).exec()
                roomExists = finalRooms.find(r => r.id === room.id)

                if (room) {
                    reservations = await ReservationRepo.checkAvailable(dateFrom, dateTo, room.id)
                    if (reservations.length === 0) {
                        finalRooms.push(room)
                    } else {
                        takenRooms.push(room)
                    }
                }

            } while ((roomExists || reservations.length>0) && room)

         
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

        // if (kidsNum > 0) {
        //     for (let index = 0; index < finalRooms.length; index++) {
        //         let room = finalRooms[index];
                
        //     }
        // }

        return finalRooms
    }

}