import { Component, OnInit } from '@angular/core';
import { RoomsService } from 'src/services/rooms/rooms.service';

@Component({
  selector: 'app-admin-rooms',
  templateUrl: './admin-rooms.component.html',
  styleUrls: ['./admin-rooms.component.css']
})
export class AdminRoomsComponent implements OnInit {

  constructor(private roomService: RoomsService) { }

  rooms: any
  editMode: any[]
  roomTypes: any

  ngOnInit() {
    this.roomService.getRoomNumbers().subscribe((rooms: any) => {
        console.log(rooms)
        this.rooms = rooms
        this.roomTypes = this.roomService.getRoomTypesFromRooms(rooms)
        this.editMode = Array(rooms.length).fill(false)
        console.log(this.roomTypes)
    })
  }

  isAdmin () {
    return localStorage.getItem('admin')
  }

  editRoom(i) {
    console.log(this.rooms[i])
    this.roomService.update(this.rooms[i].id, this.rooms[i]).subscribe((outcome:any) => {
      console.log(outcome.message)
      this.editMode[i] = false
    })
  }

  changeBookable (i) {
    if (this.editMode[i]) {
      this.rooms[i].bookable = !this.rooms[i].bookable 
    }
  }

}
