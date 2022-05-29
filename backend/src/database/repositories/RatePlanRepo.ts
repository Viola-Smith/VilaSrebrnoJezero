import RatePlan from "../models/ratePlans";
import Repo from "./Repo";


export default class RatePlanRepo extends Repo {
    constructor () {
        super(RatePlan)
    }

    public async getRatePlanByNights(numOfNights: number) {
        return await this.model.collection.findOne({ $and: [
            {
                minNights : { $lte: numOfNights }
            },
            {
                maxNights : { $gte: numOfNights }
            }
        ]})
    }
}