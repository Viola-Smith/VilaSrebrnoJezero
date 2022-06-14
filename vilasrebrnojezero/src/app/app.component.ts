import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'src/services/cookie.service';
import { VisitorService } from 'src/services/visitor.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vilasrebrnojezero';

  constructor(private router: Router, private visitorService: VisitorService, private cookieService: CookieService) {
    
  }

  ngOnInit() {
    console.log(this.isAdmin())
    if (!this.cookieService.getCookie('visitor') && !this.isAdmin()) {
      const myId = uuid.v4();
      let visitorObj = {'uuid': myId, reserved: false}
      let params = {name: 'visitor', value: JSON.stringify(visitorObj)}
      this.cookieService.setCookie(params)
      this.visitorService.add(visitorObj).subscribe((obj) => {
        console.log(obj)
      })
    }
  }

  admin = false

  isAdmin() {
    return this.admin && localStorage.getItem('admin') !== null
  }

  isLoginPage() {
    return this.router.url.includes('login')
  }

  public onRouterOutletActivate(event : any) {
    this.admin = event.isAdmin !== undefined && event.isAdmin()
  }

}
