import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationsService } from 'src/services/reservations/reservations.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private reservationService: ReservationsService) { }

  message = ''

  ngOnInit() {
    if (this.router.url.includes('confirm')) {
      let id = this.route.snapshot.paramMap.get('id')
      if (id) {
        this.reservationService.confirm(parseInt(id)).subscribe((res: any) => {
          console.log(res)
          this.message = res.message
        })
      }
    } 
  }

}
