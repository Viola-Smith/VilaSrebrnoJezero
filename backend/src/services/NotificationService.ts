import NotificationRepo from "../database/repositories/NotificationRepo";
import Service from "./Service";

export default class NotificationService extends Service {
    protected repo = new NotificationRepo()
    protected name = 'notification'

    public async getByType (type: any) {
        return this.repo.getByType(type)
    }

}