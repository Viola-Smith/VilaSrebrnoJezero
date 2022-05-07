import Pricelist from "../models/pricelist";


export default class PriceListRepo {

    public static async getPriceList() {
        return await Pricelist.collection.find().toArray()
    }

    public static async addPL(pricelist: any) {
        let PL = new Pricelist(pricelist);
        return await PL.save()
    }

    public static async updatePL(plId: number, pl: any) {
        return await Pricelist.updateOne( { id: plId }, pl ).exec()
    }

    public static async delete(id: number) {
        return await Pricelist.remove( { id: id } ).exec()
    }

}