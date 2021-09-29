import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationsService } from 'src/services/reservations/reservations.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  constructor(private router: Router, private reservationService: ReservationsService) { }

  minBookingTime

  ngOnInit() {
    this.date1 = new Date()
    this.date2 = new Date()
    this.date2.setDate(this.date1.getDate() + 2)
    this.date1 = this.date1.toISOString().split('T')[0];
    this.date2 = this.date2.toISOString().split('T')[0];
    this.reservationService.getMinBookingTime().subscribe((res) => {
      this.minBookingTime = res
      console.log(res)
    })
  }

  date1
  date2
  adults = 2
  kids = 0
  numRooms = 1

  errorMsg = ''

  closeBook() {
    let el = document.getElementById('booking')
    if (el) {
      el.style.display = 'none'
    }
  }

  redirectTo() {
    let year = this.date1.split('-')[0]
    for (let min of this.minBookingTime) {
      let date_start = new Date(year + '-' + min.date_period.date_start)
      let date_end = new Date(year + '-' + min.date_period.date_end)
      let date_end2 = new Date(date_end)
      let date_start2 = new Date(date_start)
      if (date_start > date_end) {
        date_start2 = new Date(parseInt(year) - 1 + '-' + min.date_period.date_start)
        date_end2 = new Date(parseInt(year) + 1 + '-' + min.date_period.date_end)
      }
      
      let date1 = new Date(this.date1)
      if ((date1 >= date_start && date1 <= date_end2) || (date1 >= date_start2 && date1 <= date_end)) {
        let dateBookable = new Date()
        dateBookable.setDate(new Date().getDate() + min.days )
        console.log(this.date1)
        console.log(dateBookable)
          
        if(new Date(this.date1) < dateBookable) {
          this.errorMsg = 'Morate da rezervišete barem ' + min.days + ' dana ranije.'
          return
        } else {
          break
        }
        
      }
    }
    this.errorMsg = ''
  
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/search', {
        date1: this.date1,
        date2: this.date2,
        adults: this.adults,
        kids: this.kids,
        rooms: this.numRooms
      }]));
  }
}
