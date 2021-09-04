import express from 'express';
import ReservationService from '../services/ReservationService';

const router = express.Router();


router.route('/available').get(async (req, res)=>{
	let dateFrom = req.query.dateFrom
	let dateTo = req.query.dateTo
	let adults = req.query.adults
	let kids = req.query.kids
	// let page = req.query.page
	// let pageSize = req.query.size
	res.json( await ReservationService.getAvailable(dateFrom,dateTo, adults, kids))
  }
);


module.exports = router;