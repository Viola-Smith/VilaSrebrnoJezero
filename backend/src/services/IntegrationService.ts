import IntegrationRepo from "../database/repositories/IntegrationRepo";
import CalendarService from "./CalendarService";
import Service from "./Service"

export default class IntegrationService extends Service {
    protected name = 'integration'

    protected repo = new IntegrationRepo()   

    public async disconnect(id:number) {
        return await this.repo.disconnect(id)
    }

    public async connect(id:number) {
        let integration = await this.repo.getById(id)
        let authUrl = ''
        console.log(integration)
        if (integration.name === 'Google Calendar') {
            authUrl = await CalendarService.authorizeUser()
        }
        console.log(authUrl)
        await this.repo.connect(id)
        return {'authUrl': authUrl}
    }
}
