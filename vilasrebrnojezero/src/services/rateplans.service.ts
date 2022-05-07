import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RateplansService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${this.uri}/rateplan`);
  }

  update(id, rateplan) {
    const data = {
      notif: rateplan,
    }
    return this.http.put(`${this.uri}/rateplan/${id}`, data);
  }

  add(rateplan) {
    const data = {
      notif: rateplan,
    }
    return this.http.post(`${this.uri}/rateplan`, data);
  }

  delete(id) {
    return this.http.delete(`${this.uri}/rateplan/${id}`);
  }
}
