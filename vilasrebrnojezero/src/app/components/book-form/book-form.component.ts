import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.date1 = new Date()
    this.date2 = new Date()
    this.date2.setDate(this.date1.getDate() + 2)
    this.date1 = this.date1.toISOString().split('T')[0];
    this.date2 = this.date2.toISOString().split('T')[0];
  }

  date1
  date2
  adults = 2
  kids = 0
  numRooms = 1

  closeBook() {
    let el = document.getElementById('booking')
    if (el) {
      el.style.display = 'none'
    }
  }

  redirectTo() {
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
