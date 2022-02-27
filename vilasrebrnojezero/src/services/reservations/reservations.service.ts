import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reservation } from 'src/models/reservation';


@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  book(reservation: Reservation){
    console.log(reservation)
    const data = {
      reservation: reservation
    }
    return this.http.post(`${this.uri}/reservation`, data);
  }

  getAll(){
    return this.http.get(`${this.uri}/reservation`);
  }

  reserve(reservation) {
    console.log(reservation)
    const data = {
      reservation: reservation
    }
    return this.http.post(`${this.uri}/reservation/reserve`, data);
  }

  check(reservation) {
    console.log(reservation)
    const data = {
      reservation: reservation
    }
    return this.http.post(`${this.uri}/reservation/check`, data);
  }
  
  pay(reservationObj, dates, user) {
    console.log(reservationObj)
    const data = {
      reservation: reservationObj,
      dateRange: dates,
      user: user
    }
    return this.http.post(`${this.uri}/reservation/pay`, data);
  }

  getMinBookingTime(){
    return this.http.get(`${this.uri}/reservation/minimum_booking_time`);
  }

  delete(res) {
    console.log(res)
    const data = {
      res: res
    }
    return this.http.post(`${this.uri}/reservation/delete`, data);
  }
}
