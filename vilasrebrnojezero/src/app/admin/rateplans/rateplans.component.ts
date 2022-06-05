import { Component, OnInit } from '@angular/core';
import { RateplansService } from 'src/services/rateplans.service';

@Component({
  selector: 'app-rateplans',
  templateUrl: './rateplans.component.html',
  styleUrls: ['./rateplans.component.css']
})
export class RateplansComponent implements OnInit {

  constructor(private rateplanService: RateplansService) { }

  rateplans = []


  newRateplan = {id: 0, name: '', minNights: 0, maxNights: 0, base_price_mod: 0, subtract: true, percent: true}

  ngOnInit() {
    this.getRateplans()
  }

  setModType (newType) {
    this.newRateplan.percent = newType === '0'
  }

  isAdmin () {
    return localStorage.getItem('admin') !== null
  }

  message = ''

  save () {
    if (this.newRateplan.id === 0) {
      this.rateplanService.add(this.newRateplan).subscribe((res: any) => {
        this.getRateplans(res)
      })
    } else {
      this.rateplanService.update(this.newRateplan.id, this.newRateplan).subscribe((res: any) => {
        this.getRateplans(res)
      })
    }
  
  }
  
  showModal() {
    const modal = document.querySelector('#msg-popup');
    modal.classList.remove('hide');
    setTimeout(function () {
      modal.classList.add('hide');
    }, 2000);
  }

  openEditDialog(rateplan) {
    this.newRateplan = rateplan
    this.showDialog()
  }

  createRP () {
    this.newRateplan = {id: 0, name: '', minNights: 0, maxNights: 0, base_price_mod: 0, subtract: true, percent: true}
    this.showDialog()
  }

  deleteRP (rateplan) {
    this.rateplanService.delete(rateplan.id).subscribe((res: any) => {
      this.getRateplans(res)
    })
  }

  getRateplans (res = null) {
    this.rateplanService.getAll().subscribe((rps: any) => {
      console.log(rps)
      this.rateplans = rps.sort((a,b) => a.minNights - b.minNights)
      if (res) {
        this.message = res.message
        this.showModal()
        this.hideDialog()
      }
    })
  }

  showDialog() {
    document.getElementsByClassName('createDialog')[0].classList.add('show');
  }

  hideDialog () {
    document.getElementsByClassName('createDialog')[0].classList.remove('show');
  }

}
