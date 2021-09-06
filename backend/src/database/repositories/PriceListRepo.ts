import Pricelist from "../models/pricelist";


export default class PriceListRepo {

    public static async getPriceList() {
        return await Pricelist.collection.find().toArray()
    }

}