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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private roomService: RoomsService, private reservationService: ReservationsService) { }

  // colors = ['#ffe2e8', '#eef3f8', '#eafff1', '#eef3f8', '#f6e7ea', '#e6e6fa', '#d7bfb9']
  administrator: any
  dateFrom
  dateTo
  roomSelectedId
  name: string
  email: string
  phone: string
  notes: string
  rooms: Room[]
  reservations: any
  calendarView: false
  message: string = 'msg'
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  curMonth = this.months[(new Date()).getMonth()]
  dates = this.getAllDates()

  editMode = []

  filteredReservations: any

  isAdmin () {
    return localStorage.getItem('admin') !== null
  }


  ngOnInit() {
    if (localStorage.getItem('admin')) {
      this.administrator = 'admin' //JSON.parse(localStorage.getItem('admin')) 
    } else {
      this.router.navigate(['/login'])
    }
    forkJoin([
      this.roomService.getRoomNumbers(),
      this.reservationService.getAll()
    ]).subscribe(allResults => {
      console.log(allResults)
      this.rooms = allResults[0] as Room[]
      this.roomSelectedId = this.rooms[0].id
      this.reservations = allResults[1]
      this.reservations.forEach(r => {
        r.date_from = moment(r.date_from).format("YYYY-MM-DD")
        r.date_to = moment(r.date_to).format("YYYY-MM-DD")
        r.color = Math.floor(Math.random() * 361);
      })
      this.filteredReservations = this.reservations.filter(r => (parseInt(r.date_from.split('-')[1]) - 1) == (new Date()).getMonth())
      this.editMode = Array(this.filteredReservations.length).fill(false)
      this.dateFrom = new Date()
      this.dateTo = new Date()
      this.dateTo.setDate(this.dateFrom.getDate() + 2)
      this.dateFrom = this.dateFrom.toISOString().split('T')[0];
      this.dateTo = this.dateTo.toISOString().split('T')[0];
    })
  }

  showNewReservation() {
    let el = document.getElementById('reservationForm')
    if (el) {
      if (el.style.display === 'block') {
        el.style.display = 'none'
      } else {
        el.style.display = 'block'
      }
    }
  }

  deleteRes(resId) {
    this.reservationService.delete(resId).subscribe((res: any)=>{
      console.log(res)
      this.message = res.message
      this.showModal()
      console.log(resId)
      console.log(this.reservations.map((item:any) => item.id))
      var removeIndex = this.reservations.map((item:any) => item.id).indexOf(resId);
      console.log(removeIndex)
      if (removeIndex !== -1) {
        this.reservations.splice(removeIndex, 1);
      }
    })
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

  updateRes(id, index) {
    let res = this.reservations.find(r => r.id === id)
    this.reservationService.update(id, res).subscribe((res: any) => {
      console.log(res)
      this.message = res.message
      this.showModal()
      this.editMode[index] = false
    });
  }

  book() {
    let room = this.rooms.find(r => r.id === parseInt(this.roomSelectedId)) as Room
    console.log(new Date(this.dateFrom + ' 00:00'))
    let reservation: Reservation = {
      date_from: this.dateFrom, date_to: this.dateTo, id: 0, person: {name: this.name, email: this.email, phone: this.phone},
      notes: this.notes, payed: 0, price: 0, room: room, user_id: 0, timestamp: null
    }
    console.log(reservation)
    this.reservationService.book(reservation, window.location.href).subscribe((res: any) => {
      console.log(res)
      if (res.new) {
        res.new.color = Math.floor(Math.random() * 361);
        res.new.date_from = moment(res.new.date_from).format("YYYY-MM-DD")
        res.new.date_to = moment(res.new.date_to).format("YYYY-MM-DD")
        this.reservations.push(res.new)
        this.filteredReservations.push(res.new)
        this.showNewReservation()
      }
      this.message = res.message
      this.showModal()
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
    this.filteredReservations = this.reservations.filter(r => (parseInt(r.date_from.split('-')[1]) - 1) == monthVal)
  }

  filterReservations () {
    
  }

  searchReservations (val) {
    if (val) {
      this.filteredReservations = this.reservations.filter(r => r.person.name.toLowerCase().includes(val.toLowerCase()) ||
      (r.person.email ? r.person.email.toLowerCase().includes(val.toLowerCase()) : false) || 
      (r.person.phone ? r.person.phone.toLowerCase().includes(val.toLowerCase()) : false))
    } else {
      this.filteredReservations = this.reservations.filter(r => (parseInt(r.date_from.split('-')[1]) - 1) == (this.months.indexOf(this.curMonth)))
    }
  }

  filterByRoom (room) {
    if (room == 0) {
      this.filteredReservations = this.reservations.filter(r => (parseInt(r.date_from.split('-')[1]) - 1) == (this.months.indexOf(this.curMonth)))
      return
    }
    this.filteredReservations = this.reservations.filter(r => r.room == room) 
  }

  isBetween(date, date1, date2) {
    return moment(date).isBetween(moment(date1), moment(date2)) || moment(date).isSame(moment(date1)) || moment(date).isSame(moment(date2))
  }

  getReservation(date, roomId) {
    let res = this.filteredReservations.filter(r => r.room === roomId && (new Date(date)) >= (new Date(r.date_from + 'T00:00:00.000+02:00')) && (new Date(date)) <= (new Date(r.date_to + 'T00:00:00.000+02:00'))  )
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
    let res = this.filteredReservations.filter(r => r.room === roomId && (new Date(date)) >= (new Date(r.date_from + 'T00:00:00.000+02:00')) && (new Date(date)) <= (new Date(r.date_to + 'T00:00:00.000+02:00'))  )
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

  createInvoice (resId) {
    let content = document.getElementById('invoice')
    content.style.display = 'block'
    console.log(content.innerHTML)
    html2canvas(content).then(function(canvas) {
        console.log(canvas)
        // let imgWidth = content.offsetWidth
        // let imgHeight = content.offsetHeight
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jsPDF('p', 'px', 'a4')
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        pdf.addImage(contentDataURL, 'png', 2, 0, width, height)
        pdf.save('invoice.pdf')
    });  
  }


}
