import ReservationRepo from "../database/repositories/ReservationRepo";
import PricelistService from "./PricelistService";
import RoomService from "./RoomService";



export default class ReservationService {

    public static async book(reservationObject: any) {
        let reservationsExist = await this.checkAvailable(reservationObject.date_from, reservationObject.date_to, reservationObject.room.id)
        if (reservationsExist && reservationsExist.length > 0) {
            return { 'message': 'Room not available for set dates', 'new': null }
        }
        let price = await PricelistService.calculatePrice(reservationObject.date_from, reservationObject.date_to, reservationObject.room.name)
        if (price) {
            reservationObject.price = price
            delete reservationObject.timestamp
            try {
                let outcome = await ReservationRepo.book(reservationObject)
                if (outcome) {
                    return { 'message': 'Sucessfully inserted reservation', 'new': outcome }
                } else {
                    return { 'message': 'Failed to insert reservation', 'new': null }
                }
            } catch (err) {
                return { 'message': err, 'new': null as Object }
            }
        }
    }

    public static async checkAvailable(date_from: any, date_to: any, roomId: any) {
        return await ReservationRepo.checkAvailable(date_from, date_to, roomId)
    }

    public static async getAll() {
        return await ReservationRepo.getAllReservations();
    }

    public static async reserve(reservationObj: any) {
        let roomArray = reservationObj.reservation
        let dateRange = reservationObj.dateRange
        let finalRooms = []
        for (let index = 0; index < roomArray.length; index++) {
            let room = roomArray[index];
            let amount = room.amount
            let roomTypeIds = await RoomService.getAllRoomsByType(room.type)
            let roomsAdded = []
            for (let i=0; i<roomTypeIds.length; i++) {
                const tmp = await this.checkAvailable(dateRange.date1, dateRange.date2, roomTypeIds[i].id)
                if (tmp.length === 0) {
                    let beforeMe = await ReservationRepo.reservationBefore(dateRange.date1, roomTypeIds[i].id)
                    var numberOfNights1 = Number.MAX_VALUE
                    if (beforeMe.length > 0) {
                        var timeDiff = Math.abs(new Date(dateRange.date1).getTime() - beforeMe[0].get('date_to').getTime());
                        numberOfNights1 = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    }
                    let afterMe = await ReservationRepo.reservationAfter(dateRange.date2, roomTypeIds[i].id)
                    var numberOfNights2 = Number.MAX_VALUE
                    if (afterMe.length > 0) {
                        var timeDiff = Math.abs(afterMe[0].get('date_from').getTime() - new Date(dateRange.date2).getTime());
                        numberOfNights2 = Math.floor(timeDiff / (1000 * 3600 * 24));
                    }
                    roomsAdded.push({room:roomTypeIds[i], nightsBefore: numberOfNights1, nightsAfter: numberOfNights2 })
                }
            }
            roomsAdded.sort(function(a, b) {
                if (a.nightsBefore != b.nightsBefore) return a.nightsBefore - b.nightsBefore
                else return a.nightsAfter - b.nightsAfter
            })
            for (let j = 0; j < roomsAdded.length; j++) {
                finalRooms.push(roomsAdded[j])
                if (--amount == 0) break;
            }
        }
        console.log(finalRooms)
    }

}