import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  connectUser(code, redirectUri) {
    const data = {
      code: code,
      redirectUri: redirectUri
    }
    return this.http.post(`${this.uri}/integration/connect`, data);
  }

  disconnect(integration) {
    return this.http.get(`${this.uri}/integration/disconnect/${integration.id}`);
  }

  connect(integration) {
    return this.http.get(`${this.uri}/integration/connect/${integration.id}`);
  }

  getIntegrations() {
    return this.http.get(`${this.uri}/integration`);
  }

}
