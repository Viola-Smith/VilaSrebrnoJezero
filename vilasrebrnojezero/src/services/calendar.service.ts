import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  authorizeUser(redirectUri) {
    const data = {
      redirectUri: redirectUri
    }
    return this.http.post(`${this.uri}/calendar/authorize`, data);
  }

  connectUser(code, redirectUri) {
    const data = {
      code: code,
      redirectUri: redirectUri
    }
    return this.http.post(`${this.uri}/calendar/connect`, data);
  }


  hasToken() {
    return this.http.get(`${this.uri}/calendar/token`);
  }

  disconnect() {
    return this.http.get(`${this.uri}/calendar/disconnect`);
  }

}
