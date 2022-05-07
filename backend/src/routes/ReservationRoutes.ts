import express from 'express';
import ReservationRepo from '../database/repositories/ReservationRepo';
import ReservationService from '../services/ReservationService';

const router = express.Router();

router.route('/').post(async (req, res) => {
	let reservation = req.body.reservation
	let redirectUri = req.body.redirectUri
	res.json(await ReservationService.book(reservation, redirectUri))
});

router.route('/').get(async (req, res) => {
	res.json(await ReservationService.getAll())
});

router.route('/reserve').post(async (req, res) => {
	let reservationObj = req.body.reservation
	console.log(reservationObj.reservation)
	let redirectUri = req.body.redirectUri
	res.json(await ReservationService.reserve(reservationObj, redirectUri))
});


router.route('/minimum_booking_time').get(async (req, res) => {
	res.json(await ReservationRepo.getAllMinBookingTimes())
});

router.route('/:id').delete(async (req, res) => {
	let resId = req.params.id
	res.json(await ReservationService.delete(resId))
});

router.route('/check').post(async (req, res) => {
	let reservation = req.body
	console.log(reservation)
	res.json(await ReservationService.checkAll(reservation.reservation))
});

router.route('/pay').post(async (req, res) => {
	let reservation = req.body
	console.log(reservation)
	res.json(await ReservationService.checkAll(reservation.reservation))
})

router.route('/:id').put(async (req, res) => {
	let reservation = req.body
	let id = req.params.id
	console.log(reservation)
	console.log(id)
	console.log('update')
	res.json(await ReservationService.update(id, reservation.reservation))
})

module.exports = router;