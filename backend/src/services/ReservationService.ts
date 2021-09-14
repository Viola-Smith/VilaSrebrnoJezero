import ReservationRepo from "../database/repositories/ReservationRepo";
import PricelistService from "./PricelistService";



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

}