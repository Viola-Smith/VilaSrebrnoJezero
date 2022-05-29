import Pricelist from "../models/pricelist";
import Repo from "./Repo";


export default class PriceListRepo extends Repo {
    constructor () {
        super(Pricelist)
    }

    public async getPriceListByDateAndRoom(date1: any, date2: any, room: any) {
        return await this.model.collection.find({
            $and: [
                { "period_dates.date_from" : date1 },
                { "period_dates.date_to" : date2 },
                { "room" : room }
             ]
        }).toArray()
    }

    public async getPriceListByDateRangeAndRoom(date1: any, date2: any, room: any) {
        return await this.model.collection.find({
            $and: [
                { "period_dates.date_from" : { $gte : date1 }},
                { "period_dates.date_to" : { $lte : date2 } },
                { "room" : room }
             ]
        }).toArray()
    }
}