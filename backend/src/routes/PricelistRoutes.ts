import express from 'express';
import ReservationRepo from '../database/repositories/ReservationRepo';
import PricelistService from '../services/PricelistService';

const router = express.Router();

router.route('/').post(async (req, res) => {
	let pricelist = req.body.pricelist
	res.json(await PricelistService.addPricelist(pricelist))
});

router.route('/').get(async (req, res) => {
	res.json(await PricelistService.getPricelist())
});

router.route('/:id').delete(async (req, res) => {
	let resId = req.params.id
	res.json(await PricelistService.removePricelist(parseInt(resId)))
});

router.route('/:id').put(async (req, res) => {
	let pricelist = req.body
	let id = req.params.id
	console.log(pricelist)
	console.log(id)
	console.log('update')
	res.json(await PricelistService.editPricelist(parseInt(id), pricelist))
})

module.exports = router;