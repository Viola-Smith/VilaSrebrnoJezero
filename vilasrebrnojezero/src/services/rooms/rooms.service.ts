import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getRoomNumbers() {
    return this.http.get(`${this.uri}/room`);
  }

  getRoomTypesFromRooms(rooms) {
    let roomTypes = rooms.reduce(function (r, a) {
      r[a.name] = r[a.name] || [];
      r[a.name].push(a.name);
      return r;
    }, Object.create(null))
    return roomTypes
  }

  getAvailableRooms(date1, date2, adults, rooms, kids) {
    return this.http.get(`${this.uri}/room/available`, {
      params: {
        date1: date1,
        date2: date2,
        adults: adults,
        rooms: rooms,
        kids: kids
      }
    });
  }

  update(roomId, room) {
    const data = {
      data: room,
    }
    return this.http.put(`${this.uri}/room/${roomId}`, data);
  }

  getRoom(id) {
    return this.http.get(`${this.uri}/room/` + id);
  }


}
