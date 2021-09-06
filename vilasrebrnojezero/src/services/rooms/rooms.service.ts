import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getRoomNumbers(){
    return this.http.get(`${this.uri}/room`);
  }

  
}
