import { Person } from "./person";
import { Room } from "./room";

export class Reservation {
    id: number;
    date_from: Date;
    date_to: Date;
    room: Room;
    person: Person;
    user_id: number;
    timestamp: Date;
    price: number;
    payed: number;
    notes: string;
    googleCalendarEventId: string;
    status: string
}