import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationsService } from 'src/services/reservations/reservations.service';
import { Room } from 'src/models/room';
import { RoomsService } from 'src/services/rooms/rooms.service';
import { Reservation } from 'src/models/reservation';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas, { Options } from 'html2canvas';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private translations: TranslationsService, private router: Router, private roomService: RoomsService, private reservationService: ReservationsService) { }

  // colors = ['#ffe2e8', '#eef3f8', '#eafff1', '#eef3f8', '#f6e7ea', '#e6e6fa', '#d7bfb9']
  administrator: any
  reservationId: number
  dateFrom
  dateTo
  roomSelectedId
  roomSelectedType
  name: string
  email: string
  phone: string
  notes: string
  paid: number = 0
  status = ''
  googleCalendarEventId = null
  timestamp = null
  price = 0
  rooms: Room[]
  reservations: any
  calendarView: false
  message: string = 'msg'
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  curMonth = this.months[(new Date()).getMonth()]
  dates = this.getAllDates()

  filteredReservations: any

  isAdmin () {
    return localStorage.getItem('admin') !== null
  }

  roomTypes = []

  ngOnInit() {
    if (localStorage.getItem('admin')) {
      this.administrator = 'admin' //JSON.parse(localStorage.getItem('admin')) 
    } else {
      this.router.navigate(['/login'])
    }
    this.loading = true
    forkJoin([
      this.roomService.getRoomNumbers(),
      this.reservationService.getAll()
    ]).subscribe(allResults => {
      console.log(allResults)
      this.rooms = allResults[0] as Room[]
      this.roomTypes = Object.keys(this.roomService.getRoomTypesFromRooms(this.rooms))
      console.log(this.roomTypes)
      this.roomSelectedId = 0
      this.status = 'approved'
      this.roomSelectedType = this.roomTypes[0]
      this.selectRoomType()
      this.reservations = allResults[1]
      this.reservations.forEach(r => {
        r.date_from = moment(r.date_from).format("YYYY-MM-DD")
        r.date_to = moment(r.date_to).format("YYYY-MM-DD")
        r.color = Math.floor(Math.random() * 361);
      })
      this.filteredReservations = this.reservations.filter(r => (parseInt(r.date_from.split('-')[1]) - 1) == (new Date()).getMonth())
      this.dateFrom = new Date()
      this.dateTo = new Date()
      this.dateTo.setDate(this.dateFrom.getDate() + 2)
      this.dateFrom = this.dateFrom.toISOString().split('T')[0];
      this.dateTo = this.dateTo.toISOString().split('T')[0];
      this.loading = false
    })
  }

  showNewReservation() {
    this.unsetReservation()
    this.showDialog()
  }

  showDialog() {
    document.getElementsByClassName('newDialog')[0].classList.add('show')
  }

  hideDialog() {
    document.getElementsByClassName('newDialog')[0].classList.remove('show')
  }

  deleteRes(resId) {
    this.reservationService.delete(resId).subscribe((res: any)=>{
      console.log(res)
      this.message = res.message
      this.showModal()
      this.getReservations()
    })
  }

  roomsOfType = []

  selectRoomType () {
    this.roomsOfType = this.rooms.filter(r => r.name === this.roomSelectedType)
  }

  export () {
    var data = 'id,name,email,phone,price,paid,room,startDate,endDate,notes\n';
    this.filteredReservations.forEach(function(e) {
        data += (e.id || '') + ',' 
                + (e.person.name || '') + ',' 
                + (e.person.email || '') + ',' 
                + (e.person.phone || '') + ',' 
                + (e.price || '') + ',' 
                + (e.payed || '') + ',' 
                + (e.room || '') + ',' 
                + (e.date_from || '') + ',' 
                + (e.date_to || '') + ',' 
                + (e.notes || '') + '\n';
    });
    console.log(data)
    const a = document.createElement('a');
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'Reservations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }


  editDialog(res) {
    this.showDialog()
    this.dateFrom = res.date_from
    this.dateTo = res.date_to
    this.name = res.person.name
    this.phone = res.person.phone
    this.email = res.person.email
    let roomObj = this.rooms.find(r => r.id === res.room)
    this.roomSelectedType = roomObj.name
    this.selectRoomType()
    this.roomSelectedId = res.room
    this.status = res.status ? res.status : 'approved'
    this.notes = res.notes
    this.paid = res.payed
    this.reservationId = res.id
    this.googleCalendarEventId = res.googleCalendarEventId
    this.timestamp = res.timestamp
    this.price = res.price
  }


  unsetReservation() {
    this.hideDialog()
    this.dateFrom = new Date()
    this.dateTo = new Date()
    this.dateTo.setDate(this.dateFrom.getDate() + 2)
    this.dateFrom = this.dateFrom.toISOString().split('T')[0];
    this.dateTo = this.dateTo.toISOString().split('T')[0];
    this.name = ''
    this.phone = ''
    this.email = ''
    this.roomSelectedId = '0'
    this.status = 'approved'
    this.roomSelectedType = this.roomTypes[0]
    this.notes = ''
    this.paid = 0
    this.googleCalendarEventId = null
    this.timestamp = null
    this.price = 0
    this.reservationId = null
  }


  loading = false

  getReservations () {
    forkJoin([
      this.roomService.getRoomNumbers(),
      this.reservationService.getAll()
    ]).subscribe(allResults => {
      this.rooms = allResults[0] as Room[]
      this.roomTypes = Object.keys(this.roomService.getRoomTypesFromRooms(this.rooms))
      this.reservations = allResults[1]
      this.reservations.forEach(r => {
        r.date_from = moment(r.date_from).format("YYYY-MM-DD")
        r.date_to = moment(r.date_to).format("YYYY-MM-DD")
        r.color = Math.floor(Math.random() * 361);
      })
      this.filteredReservations = this.reservations.filter(r => (parseInt(r.date_from.split('-')[1]) - 1) == (new Date()).getMonth())
      console.log(this.filteredReservations)
      this.loading = false
    })
  }

  updateRes (status = 'approved') {
    let room = this.rooms.find(r => r.id === parseInt(this.roomSelectedId)) as Room
    let reservation: Reservation = {
      date_from: this.dateFrom, date_to: this.dateTo, id: this.reservationId, 
      person: {name: this.name, email: this.email, phone: this.phone}, status: status,
      notes: this.notes, payed: this.paid, price: this.price, room: room, roomType: this.roomSelectedType,
      user_id: 0, googleCalendarEventId: this.googleCalendarEventId, timestamp: this.timestamp
    }
    console.log(reservation)
    this.reservationService.update(this.reservationId, reservation).subscribe((res: any) => {
      console.log(res)
      this.message = res.message
      this.showModal()
      console.log(res)
      if (res.outcome) {
        this.hideDialog()
        this.loading = true
        this.getReservations()
      }
    });
  }

  changeStatus(status) {
    this.updateRes(status)
  }

  book() {
    let room = this.rooms.find(r => r.id === parseInt(this.roomSelectedId)) as Room
    console.log(new Date(this.dateFrom + ' 00:00'))
    let reservation: Reservation = {
      date_from: this.dateFrom, date_to: this.dateTo, id: 0, 
      person: {name: this.name, email: this.email, phone: this.phone}, status: 'approved',
      notes: this.notes, payed: this.paid, price: 0, room: room, roomType: this.roomSelectedType, user_id: 0, timestamp: null, googleCalendarEventId: null
    }
    console.log(reservation)
    this.reservationService.book(reservation).subscribe((res: any) => {
      this.message = res.message
      console.log(res)
      this.showModal()
      if (res.new) {
        this.hideDialog()
        this.loading = true
        this.getReservations()
      }
    });
  }

  showModal() {
    const modal = document.querySelector('#msg-popup');
    modal.classList.remove('hide');
    setTimeout(function () {
      modal.classList.add('hide');
    }, 2000);
  }

  formattedDateTime(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss")
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }


  getAllDates(monthVal = null) {
    var month = monthVal ? monthVal : (new Date().getMonth())
    var year = (new Date()).getFullYear()
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  changeMonth(val) {
    let monthVal = this.months.indexOf(val)
    this.dates = this.getAllDates(monthVal)
    this.filterReservations(this.filteredRoom, this.searchTerm)
  }

  filterReservations (room, search) {
    this.filteredReservations = this.reservations.filter(r => (parseInt(r.date_from.split('-')[1]) - 1) == (this.months.indexOf(this.curMonth)))  
    if (room != 0) {
      this.filteredReservations = this.filteredReservations.filter(r => r.room == room)
    }
    if (search != '') {
      this.filteredReservations = this.filteredReservations.filter(r => r.person.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.person.email ? r.person.email.toLowerCase().includes(search.toLowerCase()) : false) || 
      (r.person.phone ? r.person.phone.toLowerCase().includes(search.toLowerCase()) : false))
    }
  }

  searchReservations (val) {
    this.filterReservations(this.filteredRoom, val)
  }

  filteredRoom = 0
  searchTerm = ''
  
  filterByRoom (room) {
    this.filteredRoom = room
    this.filterReservations(this.filteredRoom, this.searchTerm)
  }

  isBetween(date, date1, date2) {
    return moment(date).isBetween(moment(date1), moment(date2)) || moment(date).isSame(moment(date1)) || moment(date).isSame(moment(date2))
  }

  getReservation(date, roomId) {
    let res = this.reservations.filter(r => r.room === roomId && (new Date(date)) >= (new Date(r.date_from + 'T00:00:00.000+02:00')) && (new Date(date)) <= (new Date(r.date_to + 'T00:00:00.000+02:00')) && r.status !== 'cancelled'  )
    if (res.length) {
      var element = document.getElementById("Reservation " + date.getDate() + "-" + roomId);
      if (res.length > 1) {
        res.sort((a, b) => (new Date(a.date_from).getTime()) - (new Date(b.date_from).getTime()));
        element.style.background = 'linear-gradient(to bottom, hsl(' + res[0].color + ', 30%, 80%) 50%, hsl(' + res[1].color + ', 30%, 80%) 50%)';
        return ''
      } else {
        let timeDiff = Math.abs((new Date(res[0].date_from).getTime()) - (new Date(res[0].date_to).getTime()));
        let numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if ((this.formattedDate(res[0].date_from)) == this.formattedDate(date)) {
          element.style.background = 'linear-gradient(to bottom, transparent 50%, hsl(' + res[0].color + ', 30%, 80%) 50%)';
          if (numberOfNights == 1) {
            element.style.verticalAlign = 'bottom';
            return res[0].person.name.split(' ')[0]
          }
          return ''
        } else if ((this.formattedDate(res[0].date_to)) == this.formattedDate(date)) {
          element.style.background = 'linear-gradient(to bottom, hsl(' + res[0].color + ', 30%, 80%) 50%, transparent 0%)';
          if (numberOfNights == 1) {
            element.style.verticalAlign = 'top';
            return res[0].person.name.split(' ')[1]
          }
          return ''
        } else {
          element.style.backgroundColor = 'hsl(' + res[0].color + ', 30%, 80%)'
          return res[0].person.name
        }
      }
    }
    return ''
  }


  getDayInfo(date, roomId) {
    let res = this.filteredReservations.filter(r => r.room === roomId && r.status !== 'cancelled' && (new Date(date)) >= (new Date(r.date_from + 'T00:00:00.000+02:00')) && (new Date(date)) <= (new Date(r.date_to + 'T00:00:00.000+02:00'))  )
    if (res.length) {
      if (res.length > 1) {
        res.sort((a, b) => (new Date(a.date_from).getTime()) - (new Date(b.date_from).getTime()));
        return 'leaving:\n ' + res[0].person.name + '\n arriving:\n ' + res[1].person.name + ' (' + (parseInt(res[1].price) - parseInt(res[1].payed)) + ' RSD)'
      } else {
        let name = res[0].person.name
        let remainAmount = parseInt(res[0].price) - parseInt(res[0].payed)
        if ((this.formattedDate(res[0].date_from)) == this.formattedDate(date)) {
          return 'arriving:\n ' + name + ' (' + remainAmount + ' RSD)'
        } else if ((this.formattedDate(res[0].date_to)) == this.formattedDate(date)) {
          return 'leaving:\n ' + name
        } else {
          return ''
        }
      }
    }
    return ''
  }

  showInfo (date, roomId) {
    var element = document.getElementById("Info " + date.getDate() + "-" + roomId);
    element.style.display = 'block'
  }

  hideInfo (date, roomId) {
    var element = document.getElementById("Info " + date.getDate() + "-" + roomId);
    element.style.display = 'none'
  }

  checkedRes = []

  includeRes(checked, res) {
    if (checked.target.checked) {
      this.checkedRes.push(res)
    } else {
      let index = this.checkedRes.findIndex(r => r.id === res.id)
      if (index !== -1) {
        this.checkedRes.splice(index, 1)
      }
    }
    console.log(this.checkedRes)
  }

  invoiceMultiple() {
    this.createInvoice(this.checkedRes[0])
  }

  singleInvoice(res) {
    document.getElementById('invoiceRoomNumber').innerHTML = res.room
    document.getElementById('invoiceRoomType').innerHTML = this.getRoomType(res.room)
    document.getElementById('invoiceDateFrom').innerHTML = this.formattedDate(res.date_from)
    document.getElementById('invoiceNights').innerHTML = this.getNights(res.date_from, res.date_to).toString()
    document.getElementById('invoicePricePerNight').innerHTML = (res.price/this.getNights(res.date_from, res.date_to)).toFixed(2)
    document.getElementById('invoicePrice').innerHTML = res.price.toFixed(2)

    document.getElementById('invoiceTotalPrice').innerHTML = res.price.toFixed(2)
    document.getElementById('invoiceTotalDeposit').innerHTML = res.payed.toFixed(2)

    this.createInvoice(res)
  }

  createInvoice (res) {
    let content = document.getElementById('invoice')
    document.getElementById('invoiceName').innerHTML = res.person.name
    document.getElementById('invoiceJmbg').innerHTML = res.person.jmbg ? res.person.jmbg : ''
    document.getElementById('invoicePhone').innerHTML = res.person.phone ? res.person.phone : ''
    // document.getElementById('invoiceId').innerHTML = res.id

    content.style.display = 'block'
    html2canvas(content).then(function(canvas) {
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jsPDF('p', 'px', 'a4')
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        pdf.addImage(contentDataURL, 'png', 2, 0, width, height)
        pdf.save('invoice.pdf')
        document.getElementById('invoice').style.display = 'none'
    });
  }

  getRoomType (roomId) {
    this.translations.changeLanguage('en_GB')
    console.log(this.translations)
    return this.translations.labels.common[this.rooms.find(r => r.id === roomId).name]
  }

  getNights(date1, date2) {
    var timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numberOfNights
  }

  getTotalPrice(prop) {
    return this.checkedRes.reduce((a, res) => a + res[prop], 0).toFixed(2)
  }

}
