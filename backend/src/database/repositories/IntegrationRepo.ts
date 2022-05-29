import Integration from "../models/integrations"
import Repo from "./Repo"


export default class IntegrationRepo extends Repo {
    constructor () {
        super(Integration)
    }

    public async getByName(name: string) {
        return await this.model.findOne({ name: name }).exec()
    }

    public async disconnect(id:number) {
        return await this.model.updateOne({id: id}, {$set:{'enabled': false, 'content': {}}})
    }

    public async connect(id:number) {
        return await this.model.updateOne({id: id}, {$set:{'enabled': true}})
    }

    public async addContent(name: string, content: any) {
        return await this.model.updateOne({name: name}, {$set:{'content': content}})
    }

}