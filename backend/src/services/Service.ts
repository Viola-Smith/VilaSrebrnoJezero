import Repo from "../database/repositories/Repo";

export default abstract class Service {

    protected repo: Repo
    protected abstract name: string

    public async getAll () {
        return await this.repo.getAll()
    }

    public async getById(id: number) {
        return await this.repo.getById(id)
    }

    public async add (data: any) {
        try {
            await this.repo.add(data)
            return {'message': 'Succesfully added ' + this.name, outcome: true}
        } catch (e) {
            console.log(e)
            return {'message': 'Failed to add  ' + this.name, outcome: false}
        }
    }

    public async update (id: number, data: any) {
        try {
            console.log(data)
            console.log(id)
            let updated = await this.repo.update(id, data)
            if (updated.modifiedCount > 0) {
                return {'message': 'Succesfully updated ' + this.name, outcome: true, 'new': updated}
            } else {
                return {'message': 'Failed to update ' + this.name, outcome: false, 'new': updated}
            }
        } catch (e) {
            console.log(e)
            return {'message': 'Failed to update ' + this.name, outcome: false, 'new': null}
        }
    }

    public async delete (id: number) {
        try {
            await this.repo.delete(id)
            return {'message': 'Succesfully deleted '  + this.name, outcome: true}
        } catch (e) {
            console.log(e)
            return {'message': 'Failed to delete ' + this.name, outcome: false}
        }
    }     
}
