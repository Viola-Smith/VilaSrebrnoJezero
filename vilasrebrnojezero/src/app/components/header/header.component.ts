import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomsService } from 'src/services/rooms/rooms.service';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private translations: TranslationsService, private roomService: RoomsService) { }

  chosenLanguage = this.translations.getLanguage()
  otherLanguages = this.translations.getOtherLanguages()

  rooms = []

  ngOnInit() {
    this.roomService.getRoomNumbers().subscribe((rooms:any) => {
      this.rooms = Object.keys(this.roomService.getRoomTypesFromRooms(rooms)).sort()
    })
  }

  goToRooms(id) {
    localStorage.setItem('roomId', id)
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/rooms']);
  }

  showBookModal() {
    let el = document.getElementById('booking')
    if (el) {
      el.style.display='block'
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  showOtherFlags() {
    let el = document.getElementById("otherFlags")
    if (el.style.display === 'none') {
      el.style.display="block"
      document.getElementById("arrowDown").style.display='none'
      document.getElementById("arrowUp").style.display='inline-block'
   
    }
    else {
      el.style.display="none"
      document.getElementById("arrowDown").style.display='inline-block'
      document.getElementById("arrowUp").style.display='none'
   
    }
  }

  changeLang (lang) {
    this.translations.changeLanguage(lang)
    this.showOtherFlags()
  }

}
