import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  username: string
  password: string
  message

  ngOnInit() {
  }

  login() {
    if (this.username == 'milicanikolica97@gmail.com' && this.password == 'milica123') {
      console.log(true)
      localStorage.setItem('admin', 'admin')
      this.router.navigate(['/admin'])
    } else {
      this.message = "Wrong credentials."
    }
  }

}
