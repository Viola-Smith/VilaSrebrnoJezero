import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoomsComponent } from './admin/admin-rooms/admin-rooms.component';
import { CalendarComponent } from './admin/calendar/calendar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './admin/login/login.component';
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { PricelistComponent } from './admin/pricelist/pricelist.component';
import { RateplansComponent } from './admin/rateplans/rateplans.component';
import { ContactComponent } from './contact/contact.component';
import { EventsComponent } from './events/events.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { SuccessPaymentComponent } from './payment/success-payment/success-payment.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SearchRoomsComponent } from './search-rooms/search-rooms.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'rooms/:id', component: RoomsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'admin', component: DashboardComponent },
  { path: 'editrooms', component: AdminRoomsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'pricelist', component: PricelistComponent },
  { path: 'rateplans', component: RateplansComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'search', component: SearchRoomsComponent },
  { path: 'success-payment', component: SuccessPaymentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
