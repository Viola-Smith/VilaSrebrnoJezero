import CalendarService from "../services/CalendarService";
import IntegrationService from "../services/IntegrationService";
import Routes from "./Routes";

export default class IntegrationRoutes extends Routes {
	protected service = new IntegrationService()
    constructor() {
       super()

        this.router.route('/disconnect/:id').get(async (req, res) => {
            let id = req.params.id
            res.json(await new IntegrationService().disconnect(parseInt(id)))
        });

        this.router.route('/connect/:id').get(async (req, res) => {
            let id = req.params.id
            res.json(await new IntegrationService().connect(parseInt(id)))
        });

        this.router.route('/connect').post(async (req, res) => {
            let code = req.body.code
            let redirectUri = req.body.redirectUri
            console.log(code)
            console.log(redirectUri)
            res.json(await CalendarService.createAccessToken(code, redirectUri))
        });

    }
    
}

module.exports = (new IntegrationRoutes()).getRouter();