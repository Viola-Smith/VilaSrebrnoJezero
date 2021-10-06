import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ReservationsService } from 'src/services/reservations/reservations.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  showSuccess

  constructor(private reservationService: ReservationsService) { }

  ngOnInit() {
    this.initConfig();
  }

  
  @Output() closeForm = new EventEmitter<boolean>()
  @Output() prevStep = new EventEmitter<boolean>()

  @Input() reservation: any


  type = 'avans'

  private initConfig(): void {

    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AUcJ3LBxK2YlX4Pi_OD_BBbnq_bmQfE0VCSUEcytTxEhi8iGDvdJHpgnA9x4chF3ZJJHzjspHRIE2ZvH',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ],
            payee: {
              email_address: 'ljiljananikolic3004@gmail.com'
            }
          }
        ],
        payer: {
          name: {
            given_name: "PayPal",
            surname: "Customer"
          },
          // address: {
          //   address_line_1: '123 ABC Street',
          //   address_line_2: 'Apt 2',
          //   admin_area_2: 'San Jose',
          //   admin_area_1: 'CA',
          //   postal_code: '95121',
          //   country_code: 'US'
          // },
          email_address: "customer@domain.com",
          phone: {
            phone_type: "MOBILE",
            phone_number: {
              national_number: "12535551212"
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
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  pay() {
    // let user = {name: this.name, email: this.email, phone: this.phone}
    // this.reservationService.pay(this.reservation.res, this.reservation.dateRange, user)
    // .subscribe((res: any)=>{
    //   console.log(res)
    //   window.location = res.forwardLink
    // })
  }

  closeBook() {
    this.closeForm.emit(false)
  }

  goBack() {
    this.prevStep.emit(false)
  }

}
