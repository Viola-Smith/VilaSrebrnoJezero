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

  administrator: any
  dateFrom
  dateTo
  roomSelectedId
  name: string
  notes: string
  rooms: Room[]
  reservations: any

  ngOnInit() {
    // if (localStorage.getItem('admin')) {
    //   this.administrator = JSON.parse(localStorage.getItem('admin')) 
    // } else {
    //   this.router.navigate(['/login'])
    // }
    forkJoin([
      this.roomService.getRoomNumbers(),
      this.reservationService.getAll()
    ]).subscribe(allResults => {
      console.log(allResults)
      this.rooms = allResults[0] as Room[]
      this.roomSelectedId = this.rooms[0].id
      this.reservations = allResults[1]
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
    let reservation: Reservation = {
      date_from: this.dateFrom, date_to: this.dateTo, id: 0, name: this.name,
      notes: this.notes, payed: 0, price: 0, room: room, user_id: 0, timestamp: null
    }
    console.log(reservation)
    this.reservationService.book(reservation).subscribe((res: any) => {
      console.log(res.new)
      this.reservations.push(res.new)
      this.showNewReservation()
    });
  }

  formattedDateTime(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss")
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

}
