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

  getAvailableRooms(date1, date2, adults, rooms) {
    return this.http.get(`${this.uri}/room/available`, {
      params: {
        date1: date1,
        date2: date2,
        adults: adults,
        rooms: rooms
      }
    });
  }

  update(roomId, room) {
    const data = {
      data: room,
    }
    return this.http.put(`${this.uri}/room/${roomId}`, data);
  }


}
