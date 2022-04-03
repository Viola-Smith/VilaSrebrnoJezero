import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationsService } from 'src/services/reservations/reservations.service';
import { Room } from 'src/models/room';
import { RoomsService } from 'src/services/rooms/rooms.service';
import { Reservation } from 'src/models/reservation';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private roomService: RoomsService, private reservationService: ReservationsService) { }

  colors = ['#ffe2e8', '#eef3f8', '#eafff1', '#eef3f8', '#f6e7ea', '#e6e6fa', '#d7bfb9']
  administrator: any
  dateFrom
  dateTo
  roomSelectedId
  name: string
  notes: string
  rooms: Room[]
  reservations: any
  calendarView: false
  message: string = 'msg'
  dates = this.getAllDates()

  isAdmin () {
    return true
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
      this.reservations.forEach(r => r.color = this.colors[Math.floor(Math.random() * this.colors.length)])
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

  book() {
    let room = this.rooms.find(r => r.id === parseInt(this.roomSelectedId)) as Room
    console.log(new Date(this.dateFrom + ' 00:00'))
    let reservation: Reservation = {
      date_from: new Date(this.dateFrom + ' 00:00'), date_to: new Date(this.dateTo + ' 00:00'), id: 0, name: this.name,
      notes: this.notes, payed: 0, price: 0, room: room, user_id: 0, timestamp: null
    }
    console.log(reservation)
    this.reservationService.book(reservation).subscribe((res: any) => {
      console.log(res.new)
      this.message = res.message
      this.showModal()
      if (res.new) {
        res.new.color = this.colors[Math.floor(Math.random() * this.colors.length)]
        this.reservations.push(res.new)
        this.showNewReservation()
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

  getAllDates() {
    var month = (new Date()).getMonth()
    var year = (new Date()).getFullYear()
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  isBetween(date, date1, date2) {
    return moment(date).isBetween(moment(date1), moment(date2)) || moment(date).isSame(moment(date1)) || moment(date).isSame(moment(date2))
  }

  getReservation(date, roomId) {
    let res = this.reservations.find(r => r.room === roomId && (new Date(date)).getTime() >= new Date(r.date_from).getTime() && (new Date(date)).getTime() <= new Date(r.date_to).getTime()  )
    if (res) {
      var element = document.getElementById("Reservation " + date.getDate() + "-" + roomId);

      if ((this.formattedDate(res.date_from)) == this.formattedDate(date)) {
        element.style.background = 'linear-gradient(to bottom, transparent 50%, '+ res.color +' 50%)';
        return ''
      } else if ((this.formattedDate(res.date_to)) == this.formattedDate(date)) {
        element.style.background = 'linear-gradient(to bottom, '+ res.color +' 50%, transparent 0%)';
        return ''
      } else {
        element.style.backgroundColor = res.color
        return res.name
      }
    }
    return ''
  }




}
