import VisitorRepo from "../database/repositories/VisitorRepo";
import Service from "./Service"

export default class VisitorService extends Service {
    protected name = 'visitor'

    protected repo = new VisitorRepo()  
}
