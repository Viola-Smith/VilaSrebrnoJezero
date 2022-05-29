import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ReservationsService } from 'src/services/reservations/reservations.service';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  showSuccess = true

  constructor(private translations: TranslationsService, private reservationService: ReservationsService) { }

  ngOnInit() {
    this.initConfig();
  }

  bookingDone = false
  
  @Output() closeForm = new EventEmitter<boolean>()
  @Output() prevStep = new EventEmitter<boolean>()

  @Input() reservation: any


  type = 'avans'
  errorMessage = ''

  private initConfig(): void {
    let resPrice = this.reservation.price
    if (this.type === 'avans') {
      resPrice = (resPrice*0.3)
    }
    let amount = resPrice/117
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: amount.toFixed(2).toString(),
                }
            }],
            payer: {
              name: {
                given_name: this.reservation.person.name,
                surname: this.reservation.person.lname
              },
              email_address: this.reservation.person.email,
              phone: {
                phone_type: "MOBILE",
                phone_number: {
                  national_number: this.reservation.person.phone
                }
              }
            },
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.reservation.payed = resPrice
            console.log(this.reservation)
            this.reservationService.reserve(this.reservation).subscribe((outcomes: any) => {
              console.log(outcomes)
              if (outcomes) {
                let failures = outcomes.filter(o => o.new === null)
                if (!failures.length) {
                  this.bookingDone = true
                } else {
                  this.bookingDone = false
                  this.errorMessage = failures[0].message
                }
              }
            })
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('OnClick', data);
        },
        onInit: (data, actions) => {
          this.reservationService.check(this.reservation).subscribe((res) => {
            console.log(res)
            // If there is a validation error, reject, otherwise resolve
            if (!res) {
              actions.disable()
              console.log('Reservation conflict')
              this.errorMessage = 'Some of the rooms from this reservation are no longer available.'
            }
          });
        }
      };
  }

  closeBook() {
    this.closeForm.emit(false)
  }

  goBack() {
    this.prevStep.emit(false)
  }

  getNights(date1, date2) {
    var timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return numberOfNights
  }

}
