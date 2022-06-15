import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {

  constructor(private router: Router) { }

  mobileWidth = 1100
  windowWidth

  showSideMenu = true

  menuClicked = false

  ngOnInit() {
    this.windowWidth = window.innerWidth
    this.showSideMenu = this.windowWidth >= this.mobileWidth
    window.addEventListener("resize", ()=>{this.windowWidth = window.innerWidth; this.showSideMenu = this.windowWidth >= this.mobileWidth});
  }

  logOut() {
    localStorage.removeItem('admin')
  }

  showMenu() {
    this.menuClicked = !this.menuClicked
    if (this.menuClicked) {
      document.getElementsByClassName('mobMenu')[0].classList.add('show');
      document.getElementsByClassName('sidebar-container')[0].classList.add('show');
    } else {
      document.getElementsByClassName('mobMenu')[0].classList.remove('show');
      document.getElementsByClassName('sidebar-container')[0].classList.remove('show');
    }
  
  }

}
