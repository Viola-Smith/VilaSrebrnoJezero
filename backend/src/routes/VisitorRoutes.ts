import VisitorService from "../services/VisitorService";
import Routes from "./Routes";

export default class VisitorRoutes extends Routes {
	protected service = new VisitorService()
    constructor() {
       super()
    }
}

module.exports = (new VisitorRoutes()).getRouter();