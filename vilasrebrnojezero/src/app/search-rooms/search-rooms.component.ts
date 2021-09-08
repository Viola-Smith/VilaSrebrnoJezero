import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/models/room';
import { RoomsService } from 'src/services/rooms/rooms.service';

@Component({
  selector: 'app-search-rooms',
  templateUrl: './search-rooms.component.html',
  styleUrls: ['./search-rooms.component.css']
})
export class SearchRoomsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private roomService: RoomsService) { }

  availableRooms = []

  ngOnInit() {
    let date1 = this.route.snapshot.paramMap.get('date1')
    let date2 = this.route.snapshot.paramMap.get('date2')
    let adults = this.route.snapshot.paramMap.get('adults')
    let kids = this.route.snapshot.paramMap.get('kids')
    let rooms = this.route.snapshot.paramMap.get('rooms')

    document.getElementById('start').scrollIntoView({behavior: "smooth"})
    
    this.roomService.getAvailableRooms(date1, date2, adults, kids, rooms).subscribe((rooms: any)=>{
        console.log(rooms)
        this.availableRooms = rooms
    });

  }

  getName(name) {
    var regex = /\d+/;
    let res = name.match(regex)
    if (res) {
      switch(res[0]) {
        case '2':
          if (name.includes('single')) return 'Dvokrevetna singl soba'
          else return 'Dvokrevetna dubl soba'
        case '3':
          return 'Trokrevetni apartman'
        case '4':
          return 'Cetvorokrevetni apartman'
      }
    } else if (name.includes('lux')) {
      return 'Lux apartman'
    }
  }

}
