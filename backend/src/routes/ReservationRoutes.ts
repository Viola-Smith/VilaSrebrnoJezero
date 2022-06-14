import ReservationRepo from '../database/repositories/ReservationRepo';
import ReservationService from '../services/ReservationService';
import Routes from './Routes';

export default class ReservationRoutes extends Routes {
  protected service = new ReservationService()

  postRoute() {
	this.router.route('/').post(async (req, res) => {
		let reservation = req.body.reservation
		res.json(await this.service.book(reservation))
	});
  }

  constructor() {
    super()
     
    this.router.route('/reserve').post(async (req, res) => {
		let reservationObj = req.body.reservation
		console.log(reservationObj.reservation)
		res.json(await this.service.reserve(reservationObj))
	});
	
	this.router.route('/minimum_booking_time').get(async (req, res) => {
		res.json(await ReservationRepo.getAllMinBookingTimes())
	});

	this.router.route('/check').post(async (req, res) => {
		let reservation = req.body
		console.log(reservation)
		res.json(await this.service.checkAll(reservation.reservation))
	});

	this.router.route('/confirm/:id').post(async (req, res) => {
		let id = req.params.id
		res.json(await this.service.confirmBooking(parseInt(id)))
	});

	
	this.router.route('/pay').post(async (req, res) => {
		let reservation = req.body
		console.log(reservation)
		res.json(await this.service.checkAll(reservation.reservation))
	})
	
  }
}

module.exports = (new ReservationRoutes()).getRouter();
