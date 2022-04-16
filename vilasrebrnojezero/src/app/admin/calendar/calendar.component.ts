import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarService } from 'src/services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private calendarService: CalendarService, private router: Router) { }

  isAdmin () {
    return true
  }

  hasToken = false


  ngOnInit() {
    this.calendarService.hasToken().subscribe((hasToken) => {
      console.log(hasToken)
      if (hasToken) {
        this.hasToken = true
      } else {
        if (window.location.href.includes('code')) {
          let strs = window.location.href.split('?code=')
          if (strs.length >= 2) {
            console.log(strs)
            let code = strs[1].split('&scope=').length > 1 ? strs[1].split('&scope=')[0] : strs[1]
            console.log(code)
            console.log(strs[0])
            this.calendarService.connectUser(code, strs[0]).subscribe(()=>{
              console.log('user connected')
              window.location.href = strs[0]
            })
          }
        }
      }
     
    })
    
  }

  connectToGoogle() {
    if (this.hasToken) {
      this.calendarService.disconnect().subscribe(() => {
        this.hasToken = false
      })
    } else {
      console.log(window.location.href)
      console.log('hey')
      this.calendarService.authorizeUser(window.location.href).subscribe((authUrl: any) => {
        console.log(authUrl)
        window.location.href = authUrl
      })
    }
   
  }

}
