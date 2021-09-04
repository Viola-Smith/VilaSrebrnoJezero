import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeBook() {
    let el = document.getElementById('booking')
    if (el) {
      el.style.display='none'
    }
  }

}
