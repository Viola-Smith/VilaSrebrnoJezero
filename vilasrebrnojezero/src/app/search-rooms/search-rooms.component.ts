import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Room } from 'src/models/room';
import { ReservationsService } from 'src/services/reservations/reservations.service';
import { RoomsService } from 'src/services/rooms/rooms.service';

@Component({
  selector: 'app-search-rooms',
  templateUrl: './search-rooms.component.html',
  styleUrls: ['./search-rooms.component.css']
})
export class SearchRoomsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private roomService: RoomsService, private reservationService: ReservationsService) { }

  suggest = []
  allRooms = []

  date1
  date2
  adults
  rooms
  kids
  kidsCalculate

  finalReservation

  manualReservationArray = []

  showForm = false

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


  getSumPrice(rooms) {
    let sum = 0
    rooms.forEach(room => {
      sum += room.amount * room.price
    });
    return sum
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
      let num = 0
      rooms.forEach(room => {
        if (room.extra_beds) {
          if (room.extra_beds >= this.kidsCalculate) {
            num += this.kidsCalculate
            this.kidsCalculate = 0
          } else {
            this.kidsCalculate -= room.extra_beds
            num += room.extra_beds
          }
        }
      });
      return num
    }

  }

  closeForm(value) {
    this.showForm = value
  }

  getImage(type) {
    switch (type) {
      case '2bed_double': return 'dvokrevetne/1'
      case '2bed_single': return 'dvokrevetne/s1'
      case '3bed': return 'trokrevetne/tr1'
      case '4bed': return 'cetvorokrevetni/c1n'
      case 'lux': return 'cetvorokrevetni/l2'
    }
  }

  reserve(obj) {
    this.finalReservation = { res: obj, dateRange: { date1: this.date1, date2: this.date2 } }
    this.showForm = true
  }

  reserveSuggest() {
    this.manualReservationArray = this.suggest
  }

  selectAmount(amount, room) {
    let foundRoom = this.manualReservationArray.find(r => r.type === room.type)
    if (foundRoom) {
      if (amount == 0) {
        let index = this.manualReservationArray.indexOf(foundRoom)
        this.manualReservationArray.splice(index, 1);
        let el = document.getElementById('roomPrice-' + room.type)
        if (el) {
          el.style.fontWeight = 'normal'
          el.style.color = 'gray'
        }
        el = document.getElementById('roomExtra-' + room.type)
        if (el) {
          el.style.display = 'none'
        }
      } else {
        foundRoom.amount = amount
        let el = document.getElementById('roomPrice-' + room.type)
        if (el) {
          el.style.fontWeight = 'bold'
          el.style.color = 'black'
        }
        el = document.getElementById('roomExtra-' + room.type)
        if (el) {
          el.style.display = 'block'
        }
      }
    } else {
      let roomCopy = JSON.parse(JSON.stringify(room))
      roomCopy.amount = amount
      this.manualReservationArray.push(roomCopy)
      let el = document.getElementById('roomPrice-' + room.type)
      if (el) {
        el.style.fontWeight = 'bold'
        el.style.color = 'black'
      }
      el = document.getElementById('roomExtra-' + room.type)
      if (el) {
        el.style.display = 'block'
      }
    }
    console.log(this.manualReservationArray)
  }

  getPrice(room) {
    let foundRoom = this.manualReservationArray.find(r => r.type === room.type)
    if (foundRoom) {
      return foundRoom.amount * room.price
    }
    return room.price
  }

  getNights(date1, date2) {
    var timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numberOfNights
  }

}
