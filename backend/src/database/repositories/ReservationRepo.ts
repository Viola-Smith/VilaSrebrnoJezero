import MinimumBookingTime from "../models/minimumBookingTime";
import Reservation from "../models/reservation";

export default class ReservationRepo {

    public static async getAllMinBookingTimes() {
        return await MinimumBookingTime.find().exec()
    }

    public static async findLastId() {
        let lastId = 1
        let lastEl = await Reservation.find().sort({ "id": -1 }).limit(1)
        if (lastEl.length > 0) lastId = lastEl[0].get('id') + 1
        return lastId
    }

    public static async book(reservationObject: any) {
        reservationObject.room = reservationObject.room.id
        reservationObject.id = await this.findLastId();
        let newReservation = new Reservation(reservationObject);

        // return await Reservation.collection.insertOne(newReservation)
        return await newReservation.save()
    }

    public static async delete(resId: number) {
        return await Reservation.remove( { id: resId } ).exec()
    }

    public static async update(resId: number, res: any) {
        return await Reservation.updateOne( { id: resId }, res ).exec()
    }

    public static async get(resId: number) {
        return await Reservation.findOne({'id': resId}).exec()
    }

    public static async updateGCId(resId: number, gcId: any) {
        return await Reservation.updateOne( { id: resId }, { $set: { googleCalendarEventId : gcId } }, ).exec()
    }

    public static async getAllReservations() {
        return await Reservation.find().exec()
    }

    public static async reservationBefore(date1: any, roomId: number) {
        return await Reservation.find(
            {
                $and: [
                    { room: roomId },
                    { date_to: { $lte: new Date(date1) } }
                ]
            }
        ).sort({date_to: -1}).limit(1).exec()
    }

    public static async reservationAfter(date2: any, roomId: number) {
        return await Reservation.find(
            {
                $and: [
                    { room: roomId },
                    { date_from: { $gte: new Date(date2) } }
                ]
            }
        ).sort({date_from: 1}).limit(1).exec()
    }

    public static async checkAvailable(date1: any, date2: any, roomId: any) {
        return await Reservation.find(
            {
                $and: [
                    { room: roomId },
                    {
                        $or: [{
                            date_from: {
                                $gte: date1,
                                $lt: date2
                            }
                        }
                            , {
                            date_to: {
                                $gt: date1,
                                $lte: date2
                            }
                        }, {
                            $and: [{
                                date_from: {
                                    $lte: date1,
                                }
                            }, {
                                date_to: {
                                    $gte: date2
                                }
                            }]
                        }]
                    }
                ]
            }
        ).exec()
    }

    public static async checkAvailableRooms(date1: any, date2: any, roomIds: any) {
        return await Reservation.find(
                {$and: [
                    { 'room': { $in: roomIds }  },
                    {
                        $or: [{
                            date_from: {
                                $gte: date1,
                                $lt: date2
                            }
                        }
                            , {
                            date_to: {
                                $gt: date1,
                                $lte: date2
                            }
                        }, {
                            $and: [{
                                date_from: {
                                    $lte: date1,
                                }
                            }, {
                                date_to: {
                                    $gte: date2
                                }
                            }]
                        }]
                    }
                ]}
            ).exec()
    }
}