import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { HeaderComponent } from './components/header/header.component';
import { EventsComponent } from './events/events.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactComponent } from './contact/contact.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './admin/login/login.component';
import { AdminMenuComponent } from './admin/admin-menu/admin-menu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchRoomsComponent } from './search-rooms/search-rooms.component';
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { SuccessPaymentComponent } from './payment/success-payment/success-payment.component';
import { CancelPaymentComponent } from './payment/cancel-payment/cancel-payment.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { AdminRoomsComponent } from './admin/admin-rooms/admin-rooms.component';
import { CalendarComponent } from './admin/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    RoomsComponent,
    HeaderComponent,
    EventsComponent,
    GalleryComponent,
    ContactComponent,
    BookFormComponent,
    DashboardComponent,
    LoginComponent,
    AdminMenuComponent,
    SearchRoomsComponent,
    ReservationFormComponent,
    SuccessPaymentComponent,
    CancelPaymentComponent,
    PaymentFormComponent,
    AdminRoomsComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPayPalModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
