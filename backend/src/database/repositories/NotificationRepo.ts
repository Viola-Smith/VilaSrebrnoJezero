import Notification from "../models/notification";

export default class NotificationRepo {

    public static async getAllNotifications() {
        return await Notification.collection.find().toArray()
    }

    public static async update(notifId: number, notif: any) {
        return await Notification.updateOne( { id: notifId }, notif ).exec()
    }

    public static async getByType(type: any) {
        return await Notification.collection.find({ 'type': type }).toArray()
    }


}