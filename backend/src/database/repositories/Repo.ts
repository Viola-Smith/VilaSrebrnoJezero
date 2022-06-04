export default abstract class Repo {
    protected model: any;

    constructor(model: any) {
        this.model = model
    }

    public async getAll() {
        return await this.model.collection.find().toArray()
    }

    public async getById(id: number) {
        return await this.model.findOne({ id: id }).exec()
    }


    private async findLastId() {
        let lastId = 1
        let lastEl = await this.model.find().sort({ "id": -1 }).limit(1)
        if (lastEl.length > 0) lastId = lastEl[0].get('id') + 1
        return lastId
    }

    public async add(data: any) {
        data.id = await this.findLastId();
        let newRP = new this.model(data);
        return await newRP.save()
    }

    public async update(id: number, data: any) {
        return await this.model.updateOne( { id: id }, data ).exec()
    }

    public async delete(id: number) {
        return await this.model.deleteOne( { id: id } ).exec()
    }

}