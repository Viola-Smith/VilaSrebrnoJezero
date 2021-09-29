import express from 'express';
import ReservationRepo from '../database/repositories/ReservationRepo';
import ReservationService from '../services/ReservationService';

const paypal = require('paypal-rest-sdk');

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'AUcJ3LBxK2YlX4Pi_OD_BBbnq_bmQfE0VCSUEcytTxEhi8iGDvdJHpgnA9x4chF3ZJJHzjspHRIE2ZvH',
	'client_secret': 'ECao0JhIWbjAgu9ASuL6sZEu2qt-iioMHPFf34zp9t9MBOOdCea9jJDKDD_QXSpRIDy0jtjKBRCaHbZ2'
});

const router = express.Router();

router.route('/').post(async (req, res) => {
	let reservation = req.body
	res.json(await ReservationService.book(reservation.reservation))
});

router.route('/').get(async (req, res) => {
	res.json(await ReservationService.getAll())
});

router.route('/reserve').post(async (req, res) => {
	let reservationObj = req.body
	console.log(reservationObj.reservation)
	console.log(reservationObj.dateRange)
	res.json(await ReservationService.reserve(reservationObj))
});


router.route('/minimum_booking_time').get(async (req, res) => {
	res.json(await ReservationRepo.getAllMinBookingTimes())
});

router.route('/delete').post(async (req, res) => {
	let reservations = req.body
	console.log(reservations)
	res.json(await ReservationService.deleteAll(reservations.res))
});


router.route('/pay').post(async (req, res) => {
	let reservation = req.body
	console.log(reservation)
	let items: any[] = []
	let totalPrice = 0
	reservation.reservation.forEach((res: any) => {
		items.push({
			"name": res.type,
			"sku": "001",
			"price": res.price,
			"currency": "EUR",
			"quantity": res.amount
		})
		totalPrice += res.price
	});
	const create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:4200/success-payment",
			"cancel_url": "http://localhost:4200/cancel-payment"
		},
		"transactions": [{
			"item_list": {
				"items": items
			},
			"amount": {
				"currency": "EUR",
				"total": totalPrice
			},
			"payee": "ljiljananikolic3004@gmail.com",
			"description": "Washing Bar soap"
		}]
	};
	
	paypal.payment.create(create_payment_json, function (error: any, payment: { links: string | any[]; }) {
	  if (error) {
		  console.log(error);
	  } else {
		  for(let i = 0;i < payment.links.length;i++){
			if(payment.links[i].rel === 'approval_url'){
			//   res.redirect(payment.links[i].href);
				res.json({forwardLink: payment.links[i].href});	
			}
		  }
	  }
	});
	// res.json(await ReservationService.book(reservation.reservation))
});

module.exports = router;