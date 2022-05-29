import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Room } from 'src/models/room';
import { ReservationsService } from 'src/services/reservations/reservations.service';
import { RoomsService } from 'src/services/rooms/rooms.service';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-search-rooms',
  templateUrl: './search-rooms.component.html',
  styleUrls: ['./search-rooms.component.css']
})
export class SearchRoomsComponent implements OnInit {

  constructor(private translations: TranslationsService, private route: ActivatedRoute, private roomService: RoomsService, private reservationService: ReservationsService) { }

  suggest = []
  allRooms = []

  date1
  date2
  adults
  rooms
  kids
  kidsCalculate

  finalReservation

  // createdRes

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

    this.roomService.getAvailableRooms(this.date1, this.date2, this.adults, this.rooms).subscribe((rooms: any) => {
      this.suggest = rooms.suggest
      this.allRooms = rooms.all
      this.suggest.forEach(r => {
        for (let index = 0; index < r.rooms.length; index++) {
          let ebu = this.hasExtraBeds(r.rooms[index])
          r.rooms[index].extra_beds_used = ebu ? ebu : 0
          let price = this.getExtraBedPrice(r.rooms[index])
          r.rooms[index].price = price ? price.number + r.price : r.price
        }
      })

      console.log(this.suggest)
    });

  }

  formattedDateTime(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss")
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

  getExtraBedPrice(r) {
    let str = ''
    let total = 0
    for (let index = 1; index <= r.extra_beds_used; index++) {
      const extra_bed = r.extra_beds_price.find(p => p.order === index)
      let price = extra_bed.price * this.getNights(this.date1, this.date2)
      total += price
      str += ' + ' + price + ' RSD'
    }
    return { str: str, number: total }
  }

  getRoomPrice(room) {
    return room.amount * room.price + this.getAllExtraBedPrice(room).number
  }

  getAllExtraBedPrice(room) {
    let str = ''
    let sum = 0
    room.rooms.forEach(r => {
      let price = this.getExtraBedPrice(r)
      str += price.str
      sum += price.number
    });
    return { str: str, number: sum }
  }

  getSumPrice(rooms) {
    let sum = 0
    rooms.forEach(room => {
      sum += this.getRoomPrice(room)
    });
    return sum
  }

  hasExtraBeds(room) {
    if (this.kidsCalculate > 0) {
      let num = 0
      if (room.extra_beds) {
        if (room.extra_beds >= this.kidsCalculate) {
          num += this.kidsCalculate
          this.kidsCalculate = 0
        } else {
          this.kidsCalculate -= room.extra_beds
          num += room.extra_beds
        }
      }

      return num
    }

  }

  closeForm(value) {
    // console.log(this.createdRes)
    // this.reservationService.delete(this.createdRes).subscribe(()=>{
    //   this.showForm = value
    //   this.showPaymentForm = value
    //   let header = document.getElementById('header')
    //   header.style.visibility = 'visible'
    // })
    this.showForm = value
    this.showPaymentForm = value
  }

  showPaymentForm = false

  goToPayment(value) {
    console.log(value)
    this.showForm = false
    this.showPaymentForm = value.go
    this.finalReservation.person = value.person
  }

  goBack() {
    this.showPaymentForm = false
    this.showForm = true
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
    console.log(obj)
    this.finalReservation = { res: obj, dateRange: { date1: this.date1, date2: this.date2 }, price: this.getSumPrice(obj)}
    localStorage.setItem('currentReservation', JSON.stringify(this.finalReservation))
    this.showForm = true
  }

  reserveSuggest() {
    //  this.manualReservationArray = this.suggest
    this.reserve(this.suggest)
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
