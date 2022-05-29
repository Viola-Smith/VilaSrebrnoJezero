import RateplansService from "../services/RateplanService";
import Routes from "./Routes";

export default class RateplanRoutes extends Routes {
	protected service = new RateplansService()
    constructor() {
       super()
    }
}

module.exports = (new RateplanRoutes()).getRouter();