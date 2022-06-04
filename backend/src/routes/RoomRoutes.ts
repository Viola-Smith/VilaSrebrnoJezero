import RoomService from '../services/RoomService';
import Routes from './Routes';

export default class RoomRoutes extends Routes {
  protected service = new RoomService()
  constructor() {
    super()
     
    this.router.route('/available').get(async (req, res) => {
      let date1 = req.query.date1
      let date2 = req.query.date2
      let adults = req.query.adults
      let rooms = req.query.rooms
      let kids = req.query.kids
      let avRooms = await this.service.getAvailableRooms(date1, date2, adults, rooms, kids)
      let allAvRooms = await this.service.getAllAvailableRooms(date1, date2)
      res.json({suggest: avRooms, all: allAvRooms})
    });
  }
}

module.exports = (new RoomRoutes()).getRouter();

