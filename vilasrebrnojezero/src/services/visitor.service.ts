import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${this.uri}/visitor`);
  }

  add(visitor) {
    const data = {
      data: visitor,
    }
    return this.http.post(`${this.uri}/visitor`, data);
  }

  update(id, visitor) {
    const data = {
      data: visitor,
    }
    console.log(data)
    return this.http.put(`${this.uri}/visitor/${id}`, data);
  }

}
