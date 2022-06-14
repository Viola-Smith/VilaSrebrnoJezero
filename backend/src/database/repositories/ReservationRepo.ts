import MinimumBookingTime from "../models/minimumBookingTime";
import Reservation from "../models/reservation";
import Repo from "./Repo";

export default class ReservationRepo extends Repo {
    constructor () {
        super(Reservation)
    }

    public static async getAllMinBookingTimes() {
        return await MinimumBookingTime.find().exec()
    }

    public async book(reservationObject: any) {
        reservationObject.room = reservationObject.room.id
        return await this.add(reservationObject)
    }

    public async updateGCId(resId: number, gcId: any) {
        return await this.model.updateOne( { id: resId }, { $set: { googleCalendarEventId : gcId } }, ).exec()
    }

    public async confirm(resId: number) {
        return await this.model.updateOne( { id: resId }, { $set: { status : 'approved' } }, ).exec()
    }


    public async reservationBefore(date1: any, roomId: number) {
        return await this.model.find(
            {
                $and: [
                    { room: roomId },
                    { date_to: { $lte: new Date(date1) } }
                ]
            }
        ).sort({date_to: -1}).limit(1).exec()
    }

    public async reservationAfter(date2: any, roomId: number) {
        return await this.model.find(
            {
                $and: [
                    { room: roomId },
                    { date_from: { $gte: new Date(date2) } }
                ]
            }
        ).sort({date_from: 1}).limit(1).exec()
    }

    public async checkAvailable(date1: any, date2: any, roomId: any) {
        return await this.model.find(
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

    public async checkAvailableRooms(date1: any, date2: any, roomIds: any) {
        return await this.model.find(
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