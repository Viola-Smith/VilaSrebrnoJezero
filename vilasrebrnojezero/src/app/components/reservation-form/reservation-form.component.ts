import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReservationsService } from 'src/services/reservations/reservations.service';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  constructor(private reservationService: ReservationsService, private translations: TranslationsService) { }

  @Output() closeForm = new EventEmitter<boolean>()
  @Output() goToPayment = new EventEmitter<{go: boolean, person: any}>()

  @Input() reservation: any

  name: string = ''
  lname: string = ''
  email: string = ''
  phone: string = ''

  message = {name: {error: false, msg: this.translations.labels.reservation_form.name_req},
            lname: {error: false, msg: this.translations.labels.reservation_form.lname_req},
            phone: {error: false, msg: this.translations.labels.reservation_form.phone_req},
            email: {error: false, msg: this.translations.labels.reservation_form.email_req}}

  createdReservation

  ngOnInit() {
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
    if (this.name && this.lname && this.phone && this.email) {
      this.goToPayment.emit({go: true, person: {name: this.name, lname: this.lname, email: this.email, phone: this.phone}})
    } else {
      this.message.name.error = !this.name || this.name == ''
      this.message.lname.error = !this.lname || this.lname == ''
      this.message.phone.error = !this.phone || this.phone == ''
      this.message.email.error = !this.email || this.email == ''
    }
  }

  getNights(date1, date2) {
    var timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numberOfNights
  }



}
