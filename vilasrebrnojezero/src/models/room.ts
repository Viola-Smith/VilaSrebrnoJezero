import { RoomType } from "./roomTypes";

export class Room {
    id: number;
    number: number;
    room_type: RoomType;
    floor: number;
    view: boolean;
}