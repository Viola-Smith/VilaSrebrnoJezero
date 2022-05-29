import PricelistService from '../services/PricelistService';
import Routes from './Routes';

export default class PricelistRoutes extends Routes {
  protected service = new PricelistService()

  postRoute() {
	this.router.route('/').post(async (req, res) => {
		let pricelist = req.body.data
		res.json(await this.service.addPricelist(pricelist))
	});
  }

  constructor() {
    super()
     
    this.router.route('/multiple').post(async (req, res) => {
		let pricelists = req.body.data
		res.json(await this.service.addPricelists(pricelists))
	});
	
  }
}

module.exports = (new PricelistRoutes()).getRouter();