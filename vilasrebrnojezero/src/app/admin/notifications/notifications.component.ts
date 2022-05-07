import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private notificationService: NotificationsService) { }

  customerNotifications: any[]
  providerNotifications: any[]


  ngOnInit() {
    this.notificationService.getNotifications().subscribe((notifs: any) => {
      console.log(notifs)
      this.customerNotifications = notifs.filter(n => n.sendTo == 'customer')
      this.providerNotifications = notifs.filter(n => n.sendTo == 'provider')
    })
  }


  isAdmin () {
    return localStorage.getItem('admin')
  }

  message = ''

  save(notifId, customer = false) {
    let notification = customer ? this.customerNotifications.find(n => n.id == notifId) : this.providerNotifications.find(n => n.id == notifId)
    this.notificationService.updateNotification(notifId, notification).subscribe((res: any) => {
      this.message = res.message
      this.showModal()
    })
  }

  showModal() {
    const modal = document.querySelector('#msg-popup');
    modal.classList.remove('hide');
    setTimeout(function () {
      modal.classList.add('hide');
    }, 2000);
  }

}
