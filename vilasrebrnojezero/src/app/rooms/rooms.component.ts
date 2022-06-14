import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PricelistService } from 'src/services/pricelist.service';
import { RateplansService } from 'src/services/rateplans.service';
import { RoomsService } from 'src/services/rooms/rooms.service';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  constructor(private roomService: RoomsService, private translationService: TranslationsService, 
    private pricelistService: PricelistService, private rateplanService: RateplansService) { }

  roomId

  numbers10 = []
  numbers20 = []

  pricelists
  rateplans
  filteredPricelists

  ngOnInit() {
    this.roomId = localStorage.getItem('roomId')
    this.roomService.getRoomNumbers().subscribe((rooms) => {
      this.numbers10 = Array.from(Array(10).keys())
      this.numbers20 = this.numbers10.map(c => c + 10)
      this.pricelistService.getPricelistsByRoom(this.roomId).subscribe((pl:any) => {
        this.pricelists = pl
        this.filteredPricelists = this.pricelists.filter(p => p.name !== 'single_price')
        this.rateplanService.getAll().subscribe((rp:any) => {
          this.rateplans = rp
          this.rateplans.sort((a,b) => a.minNights - b.minNights)
        })
      })
    })
  }

  formatPrice(price) {
    return price.toFixed(2)
  }

  getPriceRange(pl) {
    let singlePrices = this.pricelists.filter(p => 
    (new Date(p.period_dates.date_from) >= new Date(pl.period_dates.date_from)) && 
    (new Date(p.period_dates.date_to) <= new Date(pl.period_dates.date_to)))
    
    let min = 10000000
    let max = 0

    singlePrices.forEach((singlePl) => {
      if (singlePl.base_price > max) {
        max = singlePl.base_price
      }
      if (singlePl.base_price < min) {
        min = singlePl.base_price
      }
    });

    return {min: min, max: max}
  }

  getPriceRangeString(pl) {
    let prices = this.getPriceRange(pl)
    return this.formatPrice(prices.min) + (prices.min !== prices.max ? ('-' + this.formatPrice(prices.max)) : '')
  }

  getAdjustedPriceRange (pl, rp) {
    let basePrices = this.getPriceRange(pl)
    let minPrice = this.getAdjustedPrice(basePrices.min, rp)
    let maxPrice = this.getAdjustedPrice(basePrices.max, rp)
    return this.formatPrice(minPrice) + (minPrice !== maxPrice ? ('-' + this.formatPrice(maxPrice)) : '')
  }

  getAdjustedPrice(basePrice, rp) {
    if (rp.percent) {
      return rp.subtract ? basePrice-(rp.base_price_mod/100)*basePrice : basePrice+(rp.base_price_mod/100)*basePrice
    } else {
      return rp.subtract ? basePrice-rp.base_price_mod : basePrice+rp.base_price_mod
    }
  }

}
