import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReservationsService } from 'src/services/reservations/reservations.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  constructor(private reservationService: ReservationsService) { }

  @Output() closeForm = new EventEmitter<boolean>()
  @Output() goToPayment = new EventEmitter<{go: boolean, person: any}>()

  @Input() reservation: any

  name: string = ''
  lname: string = ''
  email: string = ''
  phone: string = ''

  createdReservation

  ngOnInit() {
    console.log(this.reservation)
    // let el = document.getElementById('reservation-form')
    // if (el) {
    //   el.scrollIntoView({ behavior: "smooth" })
    // }
    window.scrollTo({ top: 80, behavior: 'smooth' });
    this.reservation.res.forEach(roomType => {
      let extra_beds = 0
      roomType.rooms.forEach(room => {
        extra_beds += room.extra_beds_used
      });
      roomType.extra_beds_used = extra_beds
    });

  }

  closeBook() {
    this.closeForm.emit(false)
  }

  nextStep() {
    this.goToPayment.emit({go: true, person: {name: this.name, lname: this.lname, email: this.email, phone: this.phone}})
  }

  getNights(date1, date2) {
    var timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numberOfNights
  }



}
