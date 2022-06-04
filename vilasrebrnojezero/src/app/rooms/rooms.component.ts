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

  ngOnInit() {
    this.roomId = localStorage.getItem('roomId')
    this.roomService.getRoomNumbers().subscribe((rooms) => {
      this.numbers10 = Array.from(Array(10).keys())
      this.numbers20 = this.numbers10.map(c => c + 10)
      this.pricelistService.getPricelistsByRoom(this.roomId).subscribe((pl:any) => {
        this.pricelists = pl
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

  getAdjustedPrice(basePrice, rp) {
    if (rp.percent) {
      return rp.subtract ? basePrice-(rp.base_price_mod/100)*basePrice : basePrice+(rp.base_price_mod/100)*basePrice
    } else {
      return rp.subtract ? basePrice-rp.base_price_mod : basePrice+rp.base_price_mod
    }
  }

}
