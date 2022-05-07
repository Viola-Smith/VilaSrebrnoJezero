import RatePlanRepo from "../database/repositories/RatePlanRepo";

export default class RateplansService {
    public static async get () {
        return await RatePlanRepo.getRatePlans()
    }

    public static async add (pl: any) {
        return await RatePlanRepo.addRatePlans(pl)
    }

    public static async edit (id: number, pl: any) {
        return await RatePlanRepo.updateRatePlan(id, pl)
    }

    public static async delete (id: number) {
        return await RatePlanRepo.delete(id)
    }     
}
