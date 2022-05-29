import PaymentService from '../services/PaymentService';
import ReservationService from '../services/ReservationService';
import Routes from './Routes';

export default class PaymentRoutes extends Routes {
  protected service = new PaymentService()
  constructor() {
    super()
     
	this.router.route('/paypal/create').post(async (req, res) => {
		let reservation = req.body
		console.log(reservation)
		res.json(await PaymentService.createPayment(reservation.reservation))
	});

	this.router.route('/paypal/execute').post(async (req, res) => {
		let reservation = req.body
		res.json(await new ReservationService().book(reservation.reservation))
	});
  }
}

module.exports = (new PaymentRoutes()).getRouter();

