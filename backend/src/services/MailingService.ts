import NotificationService from "./NotificationService";

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'milicatest265@gmail.com',
    pass: 'AmeliaSendingMail'
  }
});


export default class MailingService {

    private static sendMail (email: any, msg: any, subject: any) {
        if (email) {
            var mailOptions = {
                from: 'milicatest265@gmail.com',
                to: email,
                subject: subject,
                html: msg
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

    private static getPlaceholders(reservation: any) {
        return {
            '%person_name%': reservation.person.name,
            '%person_email%': reservation.person.email,
            '%person_phone%': reservation.person.phone,
            '%start_date%': reservation.date_from,
            '%end_date%': reservation.date_to,
            '%reservation_price%': reservation.price,
            '%reservation_paid%': reservation.payed,
            '%reservation_id%': reservation.id
        }
    }

    private static replacePlaceholders(text: any, phData: any) {
        let str = text
        let phs = Object.keys(phData)
        phs.forEach((ph:any) => {
            str = str.replace(new RegExp(ph,"g"), phData[ph]);
        })
        return str;
    }


    private static async replaceAndSend (reservation: any, type: any) {
        let notifications = await new NotificationService().getByType(type)
        notifications.forEach((notif: any) => {
            let placeholderData = this.getPlaceholders(reservation)
            let subject = this.replacePlaceholders(notif.subject, placeholderData)
            let body = this.replacePlaceholders(notif.text, placeholderData)
            if (notif.sendTo == 'customer') {
                this.sendMail(reservation.person.email, body, subject)
            } else {
                this.sendMail('milicanikolica97@gmail.com', body, subject)
            }
        })
    }

    public static async updateReservation (reservation: any) {
        await this.replaceAndSend(reservation, 'altered')
    }

    public static async cancelReservation (reservation: any) {
        await this.replaceAndSend(reservation, 'canceled')
    }

    public static async newReservation(reservation: any) {
        await this.replaceAndSend(reservation, 'confirmed')
    }

}