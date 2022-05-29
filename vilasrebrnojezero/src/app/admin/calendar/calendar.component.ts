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
    return localStorage.getItem('admin') !== null
  }

  inetgrations = []

  ngOnInit() {
    this.calendarService.getIntegrations().subscribe((ints: any) => {
      this.inetgrations = ints
      
      if (window.location.href.includes('code')) {
        let strs = window.location.href.split('?code=')
        if (strs.length >= 2) {
          let code = strs[1].split('&scope=').length > 1 ? strs[1].split('&scope=')[0] : strs[1]
          this.calendarService.connectUser(code, strs[0]).subscribe(()=>{
            console.log('user connected')
            window.location.href = strs[0]
          })
        }
      }

    })
  }

  connect (integration) {
    this.calendarService.connect(integration).subscribe((authUrl: any) => {
      console.log(authUrl)
      if (authUrl.authUrl) {
        window.location.href = authUrl.authUrl
      } else {
        integration.enabled = true
      }
    })
  }

  disconnect (integration) {
    this.calendarService.disconnect(integration).subscribe(() => {
      integration.enabled = false
    })
  }

  // connectToGoogle() {
  //   if (this.hasToken) {
  //     this.calendarService.disconnect().subscribe(() => {
  //       this.hasToken = false
  //     })
  //   } else {
  //     console.log(window.location.href)
  //     console.log('hey')
  //     this.calendarService.authorizeUser(window.location.href).subscribe((authUrl: any) => {
  //       console.log(authUrl)
  //       window.location.href = authUrl
  //     })
  //   }
  // }

}
