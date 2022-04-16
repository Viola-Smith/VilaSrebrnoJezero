import { Room } from "./room";

export class Reservation {
    id: number;
    date_from: Date;
    date_to: Date;
    room: Room;
    person: Object;
    user_id: number;
    timestamp: Date;
    price: number;
    payed: number;
    notes: string;
}