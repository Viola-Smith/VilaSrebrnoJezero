import RatePlanRepo from "../database/repositories/RatePlanRepo";
import Service from "./Service"

export default class RateplansService extends Service {
    protected name = 'rate plan'

    protected repo = new RatePlanRepo()   
}
