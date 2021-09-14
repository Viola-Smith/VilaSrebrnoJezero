import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Room } from 'src/models/room';
import { RoomsService } from 'src/services/rooms/rooms.service';

@Component({
  selector: 'app-search-rooms',
  templateUrl: './search-rooms.component.html',
  styleUrls: ['./search-rooms.component.css']
})
export class SearchRoomsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private roomService: RoomsService) { }

  suggest = []
  allRooms = []

  date1
  date2
  adults
  rooms
  kids
  kidsCalculate

  ngOnInit() {
    this.date1 = this.route.snapshot.paramMap.get('date1')
    this.date2 = this.route.snapshot.paramMap.get('date2')
    this.adults = this.route.snapshot.paramMap.get('adults')
    this.kids = this.route.snapshot.paramMap.get('kids')
    this.rooms = this.route.snapshot.paramMap.get('rooms')
    this.kidsCalculate = parseInt(this.kids)
    document.getElementById('start').scrollIntoView({ behavior: "smooth" })

    this.roomService.getAvailableRooms(this.date1, this.date2, this.adults, this.kids, this.rooms).subscribe((rooms: any) => {
      this.suggest = rooms.suggest
      this.allRooms = rooms.all
      this.suggest.forEach(r => r.extra_beds = this.hasExtraBeds(r.rooms))
      // console.log(rooms)
      console.log(rooms)
    });

  }

  formattedDateTime(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss")
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

  getName(name) {
    var regex = /\d+/;
    let res = name.match(regex)
    if (res) {
      switch (res[0]) {
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

  hasExtraBeds(rooms) {
    if (this.kidsCalculate > 0) {
      let str = ''
      rooms.forEach(room => {
        if (room.extra_beds) {
          if (room.extra_beds >= this.kidsCalculate) {
            str += ' +' + this.kidsCalculate + ' extra beds'
            this.kidsCalculate = 0
          } else {
            this.kidsCalculate -= room.extra_beds
            str += ' +' + room.extra_beds + ' extra beds'
          }
        }
      });
      return str
    }

  }

  getImage(type) {
    switch(type){
      case '2bed_double': return 'dvokrevetne/1'
      case '2bed_single': return 'dvokrevetne/s1'
      case '3bed': return 'trokrevetne/tr1'
      case '4bed': return 'cetvorokrevetni/c1n'
      case 'lux': return 'cetvorokrevetni/l2'
    }
  }

}
