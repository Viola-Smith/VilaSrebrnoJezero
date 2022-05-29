import Notification from "../models/notification";
import Repo from "./Repo";

export default class NotificationRepo extends Repo {
    constructor () {
        super(Notification)
    }

    public async getByType(type: any) {
        return await this.model.collection.find({ 'type': type }).toArray()
    }
}