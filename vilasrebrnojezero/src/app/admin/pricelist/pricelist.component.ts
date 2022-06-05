import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { PricelistService } from 'src/services/pricelist.service';
import { RoomsService } from 'src/services/rooms/rooms.service';


@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {

  constructor(private pricelistService: PricelistService, private roomService: RoomsService) { }

  pricelist = []
  dates = []
  plShown = []
  roomPrices = []
  roomsCheckbox = []

  rooms = []
  editMode = []

  ngOnInit() {
    this.pricelistService.getPricelists().subscribe((pl: any) => {
      this.pricelist = pl
      this.roomService.getRoomNumbers().subscribe((rooms: any) => {
        this.rooms = rooms
        this.dates = this.getAllDates()
        this.setPricelistForDates()
      })
    })
  }

  message = ''


  savePlChange(index) {
    let temp = this.pricelist.filter(p => p.room === this.roomPrices[index].room)
    let plToChange = []
    this.roomPrices[index].plShown.forEach((p, i) => {
      let tFind = temp.filter(tmp =>  (new Date(this.dates[i])) >= (new Date(tmp.period_dates.date_from)) && (new Date(this.dates[i])) <= (new Date(tmp.period_dates.date_to)))
      let t = tFind[tFind.length - 1]

      if (t && t.base_price !== parseInt(p)) {
        console.log(t.base_price)
        console.log(p)
        let ch = Object.assign({}, t)
        ch.base_price = parseInt(p)
        ch.name = 'single_price'
        ch.period_dates.date_from = ch.period_dates.date_to = this.dates[i]
        ch.id = 0
        delete ch._id
        plToChange.push(ch)
      }
    })

    if (plToChange.length > 0) {
      this.pricelistService.addPricelists(plToChange).subscribe((res: any)=>{
        this.message = res.message
        this.showModal()
        this.editMode[index] = false
      })
    } else {
      this.editMode[index] = false
    }
    
  }

  showModal() {
    const modal = document.querySelector('#msg-popup');
    modal.classList.remove('hide');
    setTimeout(function () {
      modal.classList.add('hide');
    }, 2000);
  }

  isAdmin () {
    return localStorage.getItem('admin') !== null
  }

  showDialog() {
    document.getElementsByClassName('bulkDialog')[0].classList.add('show');
  }

  hideDialog() {
    document.getElementsByClassName('bulkDialog')[0].classList.remove('show');
  }

  formatDate (date) {
    return moment(date).format('MMMM D, YYYY')
  }

  getAllDates(from = null, to = null) {
    var dates = [];
    var currDate = from ? moment(from).startOf('day') : moment().startOf('day');
    var lastDate = to ? moment(to).startOf('day') : moment().add(2, 'week').startOf('day');

    dates.push(currDate.clone().format('YYYY-MM-DD'));
    while(currDate.add(1, 'days').diff(lastDate) <= 0) {
        dates.push(currDate.clone().format('YYYY-MM-DD'));
    }
    return dates;
  }

  checkedOptions () {
    return this.roomsCheckbox.filter(c => c.checked)
  }

  bulkOptions = {id:0, name: '', room: '0', period_dates: {date_from: moment().format('YYYY-MM-DD'), date_to: moment().add(1, 'M').format('YYYY-MM-DD')}, base_price: 0}
  msgPriceReq = ''
  msgDate1Req = ''
  msgDate2Req = ''
  expanded = false

  bulkPricesChange () {
    this.msgPriceReq = ''
    this.msgDate1Req = ''
    this.msgDate2Req = ''

    if (!this.bulkOptions.base_price) {
      this.msgPriceReq = 'Price can not be 0'
    }
    if (!this.bulkOptions.period_dates.date_from) {
      this.msgDate1Req = 'Enter valid date'
    }
    if (!this.bulkOptions.period_dates.date_to) {
      this.msgDate2Req = 'Enter valid date'
    }
    if (isNaN(this.bulkOptions.base_price)) {
      this.msgPriceReq = 'Base price must be a number'
    }

    if (this.msgDate1Req || this.msgDate2Req || this.msgPriceReq) {
      return
    }

    let final = []
    let checkedRooms = this.roomsCheckbox.filter(c => c.checked)
    if (checkedRooms.length) {
      checkedRooms.forEach(r => {
        let rP = Object.assign({}, this.bulkOptions)
        rP.room = r.room
        final.push(rP)
      })
    } else {
      this.roomsCheckbox.forEach(r => {
        let rP = Object.assign({}, this.bulkOptions)
        rP.room = r.room
        final.push(rP)
      })
    }

    console.log(final)
    this.pricelistService.addPricelist(final).subscribe((res:any) => {
      this.pricelistService.getPricelists().subscribe((pl: any) => {
        this.pricelist = pl
        this.roomService.getRoomNumbers().subscribe((rooms: any) => {
          this.rooms = rooms
          this.dates = this.getAllDates()
          this.setPricelistForDates()
          this.hideDialog()
        })
      })
    })

  }

  search = {date_from: moment().format('YYYY-MM-DD'), date_to: moment().add(2, 'week').format('YYYY-MM-DD')}

  changeDateFrom () {
    if (moment(this.search.date_to) < moment(this.search.date_from)) {
      this.search.date_to = moment(this.search.date_from).add(1, 'week').format('YYYY-MM-DD')
    }
    this.dates = this.getAllDates(this.search.date_from, this.search.date_to)
    console.log(this.dates)
    this.setPricelistForDates()
  }

  changeDateTo () {
    if (moment(this.search.date_to) < moment(this.search.date_from)) {
      this.search.date_from = moment(this.search.date_to).subtract(1, 'week').format('YYYY-MM-DD')
    }
    this.dates = this.getAllDates(this.search.date_from, this.search.date_to)
    console.log(this.dates)
    this.setPricelistForDates()
  }

  setPricelistForDates () {
    this.roomPrices = []
    this.rooms.forEach((room) => {
      if (!this.roomPrices.find(r => r.room === room.name)) {
        let plShown = []
        this.dates.forEach((date) => {
          let price = this.pricelist.filter(p => (new Date(date)) >= (new Date(p.period_dates.date_from)) && (new Date(date)) <= (new Date(p.period_dates.date_to)) && p.room === room.name)
          plShown.push(price.length ? price[price.length - 1].base_price : 0)
        })
        let rP = {room: room.name, prices: this.pricelist.filter(p => p.room === room.name), plShown: plShown, showNamed: false}
        this.roomPrices.push(rP)
        this.editMode.push(false)
        this.roomsCheckbox.push({room: room.name, checked: false})
      }
    })
  }

  openEditDialog (pl) {
    console.log(pl)
    this.bulkOptions = pl
    this.roomsCheckbox.find(r => r.room === pl.room).checked = true
  }

  openNewDialog () {
    this.bulkOptions = {id:0, name: '', room: '0', period_dates: {date_from: moment().format('YYYY-MM-DD'), date_to: moment().add(1, 'M').format('YYYY-MM-DD')}, base_price: 0}
    this.showDialog()
  }

}
