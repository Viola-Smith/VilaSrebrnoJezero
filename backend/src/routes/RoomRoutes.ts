import express from 'express';
import RoomService from '../services/RoomService';

const router = express.Router();



router.route('/').get(async (req, res) => {
  res.json(await RoomService.getAllRooms())
});


module.exports = router;