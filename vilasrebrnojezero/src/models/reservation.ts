import { Room } from "./room";

export class Reservation {
    id: number;
    date_from: Date;
    date_to: Date;
    room: Room;
    name: string;
    user_id: number;
    timestamp: Date;
    price: number;
    payed: number;
    notes: string;
}