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

  loading = false
  showForm = false

  ngOnInit() {
    this.date1 = this.route.snapshot.paramMap.get('date1')
    this.date2 = this.route.snapshot.paramMap.get('date2')
    this.adults = this.route.snapshot.paramMap.get('adults')
    this.kids = this.route.snapshot.paramMap.get('kids')
    this.rooms = this.route.snapshot.paramMap.get('rooms')
    this.kidsCalculate = parseInt(this.kids)
    document.getElementById('start').scrollIntoView({ behavior: "smooth" })

    this.loading = true
    this.roomService.getAvailableRooms(this.date1, this.date2, this.adults, this.rooms, this.kids).subscribe((rooms: any) => {
      this.suggest = rooms.suggest
      this.allRooms = rooms.suggest
      this.loading = false
      console.log(this.suggest)
    });

  }

  formattedDateTime(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss")
  }

  formattedDate(date) {
    return moment(date).format("DD/MM/YYYY")
  }

  // getExtraBedPrice(r) {
  //   let str = ''
  //   let total = 0
  //   for (let index = 1; index <= r.extra_beds_used; index++) {
  //     const extra_bed = r.extra_beds_price.find(p => p.order === index)
  //     let price = extra_bed.price * this.getNights(this.date1, this.date2)
  //     total += price
  //     str += ' + ' + price + ' RSD'
  //   }
  //   return { str: str, number: total }
  // }

  // getRoomPrice(room) {
  //   return room.amount * room.price + parseInt(room.amount)*room.extra_bed
  // }

  // getAllExtraBedPrice(room) {
  //   let str = ''
  //   let sum = 0
  //   console.log(room)
  //   for (let i = 0; i < parseInt(room.amount); i++) {
  //     let price = this.getExtraBedPrice()
  //     sum += 
  //   }
  //   // room.rooms.forEach(r => {
   
  //   // });
  //   return { str: str, number: 0 }
  // }


  getExtraBedsPrice (room) {
    if (room.extra_beds_used) {
      return room.extra_beds_price[0].price + (room.extra_beds_used > 1 ? room.extra_beds_price[1].price : 0)
    }
    return 0
  }

  getSumPrice(rooms) {
    let sum = 0
    rooms.forEach(room => {
      sum += room.price*room.amount + this.getExtraBedsPrice(room)*room.amount
    });
    return sum
  }

  selectExtraBed (room, checked) {
    let r = this.manualReservationArray.find(r => r.name === room.name)
    if (r) {
      if (checked) {
        r.extra_beds_used = r.extra_beds_used ? r.extra_beds_used + 1 : 1
      } else {
        r.extra_beds_used = r.extra_beds_used ? r.extra_beds_used - 1 : 0
      }
    }
  }

  roomSelected (room) {
    let selectedRoom =  this.manualReservationArray.find(r => r.name === room.name)
    return selectedRoom ? selectedRoom.amount > 0 : false
  }

  closeForm(value) {
    this.showForm = value
    this.showPaymentForm = value
  }

  showPaymentForm = false

  goToPayment(value) {
    this.showForm = false
    this.showPaymentForm = value.go
    this.finalReservation.person = value.person
  }

  goBack() {
    this.showPaymentForm = false
    this.showForm = true
  }

  reserve(obj) {
    this.finalReservation = { res: obj, dateRange: { date1: this.date1, date2: this.date2 }, price: this.getSumPrice(obj)}
    localStorage.setItem('currentReservation', JSON.stringify(this.finalReservation))
    this.showForm = true
  }

  reserveSuggest() {
    //  this.manualReservationArray = this.suggest
    this.reserve(this.suggest)
  }

  selectAmount(amount, room) {
    let foundRoom = this.manualReservationArray.find(r => r.name === room.name)
    if (foundRoom) {
        foundRoom.amount = parseInt(amount)    
    } else {
      let roomCopy = JSON.parse(JSON.stringify(room))
      roomCopy.amount = parseInt(amount)
      this.manualReservationArray.push(roomCopy)
    }
  }



  getPrice(room) {
    let foundRoom = this.manualReservationArray.find(r => r.name === room.name)
    if (foundRoom) {
      return foundRoom.amount * foundRoom.price + this.getExtraBedsPrice(foundRoom) * foundRoom.amount
    }
    return room.price  + this.getExtraBedsPrice(room)
  }

  getNights(date1, date2) {
    var timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numberOfNights
  }

}
