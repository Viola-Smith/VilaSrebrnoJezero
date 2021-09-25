import express from 'express';
import RoomService from '../services/RoomService';

const router = express.Router();



router.route('/').get(async (req, res) => {
  res.json(await RoomService.getAllRooms())
});


router.route('/available').get(async (req, res) => {
  let date1 = req.query.date1
  let date2 = req.query.date2
  let adults = req.query.adults
  let rooms = req.query.rooms
  let avRooms = await RoomService.getAvailableRooms(date1, date2, adults, rooms)
  let allAvRooms = await RoomService.getAllAvailableRooms(date1, date2)
  res.json({suggest: avRooms, all: allAvRooms})
});

module.exports = router;