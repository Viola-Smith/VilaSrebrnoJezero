import express from 'express';
import RateplanService from '../services/RateplanService';

const router = express.Router();

router.route('/').post(async (req, res) => {
	let rateplan = req.body.rateplan
	res.json(await RateplanService.add(rateplan))
});

router.route('/').get(async (req, res) => {
	res.json(await RateplanService.get())
});

router.route('/:id').delete(async (req, res) => {
	let id = req.params.id
	res.json(await RateplanService.delete(parseInt(id)))
});

router.route('/:id').put(async (req, res) => {
	let rateplan = req.body
	let id = req.params.id
	console.log(rateplan)
	console.log(id)
	console.log('update')
	res.json(await RateplanService.edit(parseInt(id), rateplan))
})

module.exports = router;