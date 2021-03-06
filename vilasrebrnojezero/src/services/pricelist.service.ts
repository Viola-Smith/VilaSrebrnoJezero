import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getPricelists() {
    return this.http.get(`${this.uri}/pricelist`);
  }

  getPricelistsByRoom(roomId) {
    return this.http.get(`${this.uri}/pricelist/room/${roomId}`);
  }

  updatePricelist(id, pricelist) {
    const data = {
      data: pricelist,
    }
    return this.http.put(`${this.uri}/pricelist/${id}`, data);
  }

  addPricelist(pricelist) {
    const data = {
      data: pricelist,
    }
    return this.http.post(`${this.uri}/pricelist`, data);
  }

  addPricelists(pricelists) {
    const data = {
      data: pricelists,
    }
    return this.http.post(`${this.uri}/pricelist/multiple`, data);
  }

  deletePricelist(id) {
    return this.http.delete(`${this.uri}/pricelist/${id}`);
  }

}
