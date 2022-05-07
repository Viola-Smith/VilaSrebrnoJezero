import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vilasrebrnojezero';

  constructor(private router: Router) {}

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
