var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'milicatest265@gmail.com',
    pass: 'BetonijaTest1'
  }
});


export default class MailingService {
    public static mail(reservation: any) {
        console.log(reservation)
        let message = "<p>Dear, " + reservation.person.name + "</p><p>Your reservation for Vila Srebrno Jezero is confirmed. <br>The reservation is made from " + reservation.date_from +" to " + reservation.date_to + ". <br>Total price: " + reservation.price + " <br></p><p>Kind regards, <br>Vila Srebrno Jezero</p>"
        var mailOptions = {
            from: 'milicatest265@gmail.com',
            to: reservation.person.email,
            subject: 'Reservation Confirmation',
            text: message
        };
        transporter.sendMail(mailOptions, function(error:any, info:any){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        message = "<p>Hello</p><p>You have a new reservation for Vila Srebrno Jezero. <br>The reservation is made from " + reservation.date_from +" to " + reservation.date_to + ". <br>Total price: " + reservation.price + " <br> The customer is: " + reservation.person.name + ", " + reservation.person.email + ", " + reservation.person.phone + "</p><p>Kind regards, <br>Vila Srebrno Jezero</p>"
        mailOptions = {
            from: 'milicatest265@gmail.com',
            to: 'milicanikolica97@gmail.com',
            subject: 'Reservation Confirmation',
            text: message
        };
        transporter.sendMail(mailOptions, function(error:any, info:any){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}