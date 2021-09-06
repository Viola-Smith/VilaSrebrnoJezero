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

module.exports = router;