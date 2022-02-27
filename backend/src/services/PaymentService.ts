import ReservationService from "./ReservationService";

var request = require('request');

var CLIENT = 'AUcJ3LBxK2YlX4Pi_OD_BBbnq_bmQfE0VCSUEcytTxEhi8iGDvdJHpgnA9x4chF3ZJJHzjspHRIE2ZvH';
var SECRET = 'ECao0JhIWbjAgu9ASuL6sZEu2qt-iioMHPFf34zp9t9MBOOdCea9jJDKDD_QXSpRIDy0jtjKBRCaHbZ2';
var PAYPAL_API = 'https://api-m.sandbox.paypal.com';


export default class PaymentService {
    public static async createPayment(reservation: any) {
        let ok = await ReservationService.checkAll(reservation)
        if (!ok) return false
        this.createPayPalPayment(reservation.price)
    }

    public static async createPayPalPayment(amount: number) {
        request.post(PAYPAL_API + '/v1/payments/payment', {
            auth: { user: CLIENT, pass: SECRET},
            body:
            {
                intent: 'sale',
                payer:{ payment_method: 'paypal'},
                transactions: [{ amount: { total: (amount/117).toFixed(2).toString(), currency: 'EUR'}}],
                redirect_urls:{
                    return_url: 'https://example.com',
                    cancel_url: 'https://example.com'
                }
            },
            json: true
            }, function(err: any, response: any) {
                if (err) {
                    console.error(err);
                    return {success: false, data: err};
                }
                // 3. Return the payment ID to the client
                return {success: true, data: {id: response.body.id}};
            });
    }

    public static async executePayment(paymentID : number, payerID: number, amount: number) {
        // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute', {
            auth:{user: CLIENT, pass: SECRET},
            body:
            {
              payer_id: payerID,
              transactions: [{amount:{total: (amount/117).toFixed(2).toString(), currency: 'EUR'}}]
            },
            json: true
          },
          function(err:any, response:any) {
            if (err) {
                console.error(err);
                return {success: false, data: err};
            }
            return {success: true, data: response};
          });
    }

}