const { RoomType } = require('../models/roomType');

export default class DreamRepo {

    public static async getAvailable(dateFrom: any, dateTo: any, adults: any, kids: any){
        return await RoomType.find()
    }


}