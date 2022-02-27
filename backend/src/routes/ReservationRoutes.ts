import express from 'express';
import ReservationRepo from '../database/repositories/ReservationRepo';
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
	res.json(await ReservationService.reserve(reservationObj.reservation))
});


router.route('/minimum_booking_time').get(async (req, res) => {
	res.json(await ReservationRepo.getAllMinBookingTimes())
});

router.route('/delete').post(async (req, res) => {
	let reservations = req.body
	console.log(reservations)
	res.json(await ReservationService.deleteAll(reservations.res))
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

module.exports = router;