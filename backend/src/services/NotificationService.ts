import NotificationRepo from "../database/repositories/NotificationRepo";

export default class NotificationService {

    public static async getAll() {
        return await NotificationRepo.getAllNotifications()
    }

    public static async update (notifId: any, notif:any) {
        let updated = await NotificationRepo.update(notifId, notif)
        console.log(updated)
        if (updated.modifiedCount > 0) {
            return { 'message': 'Sucessfully edited notification' } 
        } else {
            return { 'message': 'Failed to edit notification' } 
        }
    }

    public static async getByType (type: any) {
        return await NotificationRepo.getByType(type)
    }

}