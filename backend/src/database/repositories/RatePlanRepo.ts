import RatePlan from "../models/ratePlans";


export default class RatePlanRepo {

    public static async getRatePlans() {
        return await RatePlan.collection.find().toArray()
    }

    public static async getRatePlanByNights(numOfNights: number) {
        return await RatePlan.collection.findOne({ $and: [
            {
                minNights : { $lte: numOfNights }
            },
            {
                maxNights : { $gte: numOfNights }
            }
        ]})
    }

    public static async addRatePlans(ratePlan: any) {
        let newRP = new RatePlan(ratePlan);
        return await newRP.save()
    }

    public static async updateRatePlan(ratePlanId: number, ratePlan: any) {
        return await RatePlan.updateOne( { id: ratePlanId }, ratePlan ).exec()
    }

    public static async delete(id: number) {
        return await RatePlan.remove( { id: id } ).exec()
    }

}