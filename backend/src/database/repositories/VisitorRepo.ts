import Repo from "./Repo";
import Visitor from "../models/visitor"

export default class VisitorRepo extends Repo {
    constructor() {
        super(Visitor);
    }

    public async update(id: number, data: any) {
        return await this.model.updateOne( { uuid: id }, data ).exec()
    }

}