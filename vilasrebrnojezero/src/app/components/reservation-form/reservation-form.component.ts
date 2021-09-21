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
  @Input() reservation: any

  name: string = ''
  email: string = ''
  phone: string = ''


  ngOnInit() {
    console.log(this.reservation)
    // let el = document.getElementById('reservation-form')
    // if (el) {
    //   el.scrollIntoView({ behavior: "smooth" })
    // }
    window.scrollTo({top: 80, behavior: 'smooth'});
  }

  closeBook() {
    this.closeForm.emit(false)
  }

  getNights(date1, date2) {
    var timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numberOfNights
  }

  reserve() {
    this.reservationService.reserve(this.reservation.res, this.reservation.dateRange).subscribe()
  }

  pay() {
    this.reservationService.pay(this.reservation.res, this.reservation.dateRange).subscribe((res: any)=>{
      console.log(res)
      window.location = res.forwardLink
    })
  }

}
