// import express from 'express';


// const router = express.Router();

// import DreamService from '../services/DreamService'


// router.route('/').post(async (req, res)=>{
// 	let dreamInfo = req.body.dream
// 	res.json( await DreamService.createDream(dreamInfo))
//   }
// );

// router.route('/').get(async (req, res)=>{
// 	res.json( await DreamService.getAllDreams())
//   }
// );

// router.route('/:id').get(async (req, res)=>{
// 	let id = req.params.id
// 	res.json( await DreamService.findDream(Number(id)))
//   }
// );

// router.route('/:id').put(async (req, res)=>{
// 	let id = req.params.id
// 	let dream = req.body.dream
// 	res.json( await DreamService.updateDream(Number(id),dream))
//   }
// );

// router.route('/:id').delete(async (req, res)=>{
// 	let id = req.params.id
// 	res.json( await DreamService.deleteDream(Number(id)))
//   }
// );




// module.exports = router;