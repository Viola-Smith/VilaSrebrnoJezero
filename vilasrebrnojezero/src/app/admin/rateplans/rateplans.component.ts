import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rateplans',
  templateUrl: './rateplans.component.html',
  styleUrls: ['./rateplans.component.css']
})
export class RateplansComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isAdmin () {
    return localStorage.getItem('admin') !== null
  }
  
}
