import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { PricelistService } from 'src/services/pricelist.service';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {

  constructor(private pricelistService: PricelistService) { }

  pricelist = []
  dates = []
  plShown = []

  ngOnInit() {
    this.pricelistService.getPricelists().subscribe((pl: any) => {
      this.pricelist = pl
      this.dates = this.getAllDates().slice(0, 15)
      this.dates.forEach((date) => {
        let price = this.pricelist.find(p => (new Date(date)) >= (new Date(p.period_dates.date_from)) && (new Date(date)) <= (new Date(p.period_dates.date_to)))
        this.plShown.push(price ? price.base_price : 0)
      })
    })
  }

  isAdmin () {
    return localStorage.getItem('admin') !== null
  }

  getAllDates(monthVal = null) {
    var month = monthVal ? monthVal : (new Date().getMonth())
    var year = (new Date()).getFullYear()
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(moment(date).format('YYYY-MM-DD'));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

}
