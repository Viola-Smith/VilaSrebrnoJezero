import NotificationService from "../services/NotificationService";
import Routes from "./Routes";

export default class NotificationRoutes extends Routes {
	protected service = new NotificationService()
    constructor() {
       super()
    }
}

module.exports = (new NotificationRoutes()).getRouter();