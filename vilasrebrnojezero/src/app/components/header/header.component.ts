import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToRooms(id: string) {
    this.router.navigate(['/rooms'], { queryParams: { id: id } });
  }

  showBookModal() {
    let el = document.getElementById('booking')
    if (el) {
      el.style.display='block'
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

}
