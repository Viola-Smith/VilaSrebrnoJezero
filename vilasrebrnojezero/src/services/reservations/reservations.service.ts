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

  confirm(reservationId: number){
    console.log(reservationId)
    const data = {
      status: 'approved'
    }
    return this.http.post(`${this.uri}/reservation/confirm/${reservationId}`, data);
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

  update(resId, reservationObj) {
    console.log(reservationObj)
    const data = {
      data: reservationObj,
    }
    return this.http.put(`${this.uri}/reservation/${resId}`, data);
  }

  getMinBookingTime(){
    return this.http.get(`${this.uri}/reservation/minimum_booking_time`);
  }

  delete(resId) {
    return this.http.delete(`${this.uri}/reservation/${resId}`);
  }

  exchangeRate() {
    let apiKey = '4d2a3e4a7b-4cc830aa0a-rdhe5o'
    return this.http.get('https://api.fastforex.io/fetch-one?from=EUR&to=RSD&api_key='+apiKey);
  }
}
