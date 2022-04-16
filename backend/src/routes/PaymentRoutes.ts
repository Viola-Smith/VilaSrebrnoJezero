import express from 'express';
import PaymentService from '../services/PaymentService';
import ReservationRepo from '../database/repositories/ReservationRepo';
import ReservationService from '../services/ReservationService';


const router = express.Router();

router.route('/paypal/create').post(async (req, res) => {
	let reservation = req.body
	console.log(reservation)
	res.json(await PaymentService.createPayment(reservation.reservation))
});

router.route('/paypal/execute').post(async (req, res) => {
	let reservation = req.body
	let redirectUri = req.body.redirectUri
	res.json(await ReservationService.book(reservation.reservation, redirectUri))
});


module.exports = router;
