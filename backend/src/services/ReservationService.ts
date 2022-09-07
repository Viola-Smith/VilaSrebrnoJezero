import ReservationRepo from "../database/repositories/ReservationRepo";
import BookingService from "./BookingService";
import CalendarService from "./CalendarService";
import IntegrationService from "./IntegrationService";
import MailingService from "./MailingService";
import PricelistService from "./PricelistService";
import RoomService from "./RoomService";
import Service from "./Service";

export default class ReservationService extends Service {
    protected repo = new ReservationRepo()
    private roomService = new RoomService()
    protected name = 'reservation'

    public async checkAvailable(date_from: any, date_to: any, roomId: any) {
        return await this.repo.checkAvailable(date_from, date_to, roomId)
    }

    public async book(reservationObject: any) {
        console.log(reservationObject)
        if (!reservationObject.room) {
            reservationObject.amount = 1
            reservationObject.name = reservationObject.roomType
            let rooms = await this.getRooms([reservationObject], {date1: reservationObject.date_from, date2: reservationObject.date_to, })
            if (rooms.length > 0) {
                reservationObject.room = rooms[0].room
            } else {
                return { 'message': 'No available rooms found', 'new': null }
            }
        }
        console.log(reservationObject)
        let price = await new PricelistService().calculatePrice(reservationObject.date_from, reservationObject.date_to, reservationObject.room.name)
        console.log(price)
        if (price) {
            reservationObject.price = price
            delete reservationObject.timestamp
            return await this.create(reservationObject)
        }
        return { 'message': 'Price is 0', 'new': null }
    }

    public async create(reservationObject: any) {
        let reservationsExist = await this.checkAvailable(reservationObject.date_from, reservationObject.date_to, reservationObject.room.id)
        if (reservationsExist && reservationsExist.length > 0) {
            return { 'message': 'Room not available for set dates', 'new': null }
        }
        console.log(reservationObject)
        try {
            let outcome = await this.repo.book(reservationObject)
            console.log(outcome)
            if (outcome) {
                let integrations = await (new IntegrationService()).getAll()
                let calendarEnabled = integrations.find((i:any) => i.name === 'Google Calendar').enabled
                let bookingEnabled = integrations.find((i:any) => i.name === 'Booking.com').enabled

                MailingService.newReservation(reservationObject)
                
                if (calendarEnabled) {
                    await CalendarService.createEvent(reservationObject, outcome.id)
                }
                let success = bookingEnabled ? await BookingService.makeBooking(reservationObject) : true
                
                if (success) {
                    return { 'message': 'Sucessfully inserted reservation', 'new': outcome }
                } else {
                    return { 'message': 'Failed sync with Booking.com', 'new': outcome }
                }
            } else {
                return { 'message': 'Failed to insert reservation', 'new': null }
            }
        } catch (err) {
            console.log(err)
            return { 'message': err, 'new': null as Object }
        }
    }

    
    public async checkAll(reservation: any) {
        for (var roomType of reservation.res) {
            console.log(roomType)
            let rooms = await this.roomService.getAllRoomsByType(roomType.name)
            let roomIds = rooms.map((r:any) => r.id)
            let exists = await this.repo.checkAvailableRooms(reservation.dateRange.date1, reservation.dateRange.date2, roomIds)
            if (exists && (roomIds.length - exists.length) < roomType.amount) {
                return false
            }
        }
        return true
    }



    private async getRooms(res: any, resDateRange: any) {
        console.log(res)
        let roomArray = res
        let dateRange = resDateRange
        let finalRooms = []
        for (let index = 0; index < roomArray.length; index++) {
            let room = roomArray[index];
            // let extra_beds = room.rooms[0].extra_beds_used
            let amount = room.amount
            let roomTypeIds = await this.roomService.getAllRoomsByType(room.name)
            let roomsAdded = []
            for (let i = 0; i < roomTypeIds.length; i++) {
                const tmp = await this.checkAvailable(dateRange.date1, dateRange.date2, roomTypeIds[i].id)
                if (tmp.length === 0) {
                    let beforeMe = await this.repo.reservationBefore(dateRange.date1, roomTypeIds[i].id)
                    var numberOfNights1 = Number.MAX_VALUE
                    if (beforeMe.length > 0) {
                        var timeDiff = Math.abs(new Date(dateRange.date1).getTime() - beforeMe[0].get('date_to').getTime());
                        numberOfNights1 = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    }
                    let afterMe = await this.repo.reservationAfter(dateRange.date2, roomTypeIds[i].id)
                    var numberOfNights2 = Number.MAX_VALUE
                    if (afterMe.length > 0) {
                        var timeDiff = Math.abs(afterMe[0].get('date_from').getTime() - new Date(dateRange.date2).getTime());
                        numberOfNights2 = Math.floor(timeDiff / (1000 * 3600 * 24));
                    }
                    // roomTypeIds.extra_beds_used = extra_beds
                    roomsAdded.push({ room: roomTypeIds[i], extra_beds: room.extra_beds_used, nightsBefore: numberOfNights1, nightsAfter: numberOfNights2 })
                }
            }
            roomsAdded.sort(function (a, b) {
                if (a.nightsBefore != b.nightsBefore) return a.nightsBefore - b.nightsBefore
                else return a.nightsAfter - b.nightsAfter
            })
            for (let j = 0; j < roomsAdded.length; j++) {
                finalRooms.push(roomsAdded[j])
                if (--amount == 0) break;
            }
        }
        console.log(finalRooms)
        return finalRooms
    }

    public async reserve(reservationObj: any) {
        let rooms = await this.getRooms(reservationObj.res, reservationObj.dateRange)
        let outcomes = []
        for (let room of rooms) {
            let res = {
                date_from: reservationObj.dateRange.date1,
                date_to: reservationObj.dateRange.date2,
                room: room.room,
                extra_beds: room.extra_beds,
                price: reservationObj.price,
                payed: reservationObj.payed,
                person: {
                    name:  reservationObj.person.name + ' ' + reservationObj.person.lname,
                    email: reservationObj.person.email,
                    phone: reservationObj.person.phone
                },
                user_id: 0,
                status: 'pending'
            }
            let outcome = await this.create(res)
            outcomes.push(outcome)
        }
        return outcomes
    }

    public async delete(resId: any) {
        let res = await this.repo.getById(resId)
        if (res) {
            try {
                let outcome = await super.delete(resId)
                console.log(res.get('googleCalendarEventId'))
                
                MailingService.cancelReservation(res)
                if (res.get('googleCalendarEventId')) {
                    console.log(res.get('googleCalendarEventId'))
                    let resObj = JSON.parse(JSON.stringify(res))
            
                    await CalendarService.editEvent(resObj, resObj.googleCalendarEventId, 'cancelled')
                }
                return outcome
            } catch (err) {
                return { 'message': err, outcome: false }
            }
        }
        return { 'message': 'Failed to find reservation to cancel', outcome: false }
    }

    public async update(resId: number, res: any) {
        try {
            res.payed = parseInt(res.payed)
            let price = await new PricelistService().calculatePrice(res.date_from, res.date_to, res.room.name)
            console.log(res)
            if (!price) {  
                return { 'message': 'Prices undefined for period and room', outcome: false, 'new': null as Object }
            }
            res.price = price
            let reservationsExist = await this.checkAvailable(res.date_from, res.date_to, res.room.id)
            reservationsExist = reservationsExist ? reservationsExist.filter((r:any) => r.id !== resId ) : []
            console.log(reservationsExist)
            if (reservationsExist && reservationsExist.length > 0) {
                return { 'message': 'Room not available for set dates', outcome: false, 'new': null }
            }
            res.room = res.room.id
            let outcome = await super.update(resId, res)
            if (outcome.outcome) {
                MailingService.updateReservation(res)
                await CalendarService.editEvent(res, res.googleCalendarEventId)
                return outcome
            } else {
                return outcome
            }
        } catch (err) {
            return { 'message': err, outcome: false, 'new': null as Object }
        }
    }

    public async confirmBooking(id: number) {
        let res = await this.repo.getById(id)
        if (res) {
            let updated = await this.repo.confirm(id)
            if (updated.modifiedCount > 0) {
                return {'message': 'Succesfully confirmed reservation', outcome: true, 'new': updated}
            } else {
                return {'message': 'Reservation already confirmed', outcome: false, 'new': updated}
            }
        } else {
            return { 'message': 'Reservation not found', outcome: false, 'new': null as Object }
        }
    }

}