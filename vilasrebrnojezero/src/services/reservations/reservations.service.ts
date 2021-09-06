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


}