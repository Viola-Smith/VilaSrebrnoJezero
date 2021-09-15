import express from 'express';
import ReservationService from '../services/ReservationService';

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

module.exports = router;