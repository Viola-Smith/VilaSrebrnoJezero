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

  getAvailableRooms(date1, date2, adults, kids, rooms) {
    return this.http.get(`${this.uri}/room/available`, {
      params: {
        date1: date1,
        date2: date2,
        adults: adults,
        kids: kids,
        rooms: rooms
      }
    });
  }


}
