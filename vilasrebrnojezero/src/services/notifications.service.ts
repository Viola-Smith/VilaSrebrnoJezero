import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getNotifications() {
    return this.http.get(`${this.uri}/notification`);
  }

  updateNotification(notfiId, notif) {
    const data = {
      data: notif,
    }
    return this.http.put(`${this.uri}/notification/${notfiId}`, data);
  }

}
