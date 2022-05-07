import Helper from "../helpers/Helper";
import PriceListRepo from "../database/repositories/PriceListRepo";
import RatePlanRepo from "../database/repositories/RatePlanRepo";



export default class PricelistService {

    public static async calculatePrice(dateFrom: string, dateTo: string, room: string) {
        let pricelist = await this.getPricelist()
        let date1 = new Date(dateFrom)
        let date2 = new Date(dateTo)

        var numberOfNights = Helper.getNumberOfNights(date2, date1)

        let totalPrice = 0
        let currentDate = new Date(dateFrom);
        while (currentDate <= date2) {
            let price = pricelist.find(p => currentDate >= p.period_dates.date_from && currentDate <= p.period_dates.date_to && room.includes(p.room))
            if (price) {
                if (numberOfNights > 0) {
                    totalPrice += price.base_price
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        let ratePlan = await RatePlanRepo.getRatePlanByNights(numberOfNights)
        console.log(ratePlan)
        if (ratePlan) {
            let modification = (ratePlan.get('base_price_mod')/100)*totalPrice
            if (modification) {
                if (ratePlan.get('subtract') === true) {
                    totalPrice -= modification
                } else if (ratePlan.get('subtract') === false) {
                    totalPrice += modification
                }
            }
        }

        return totalPrice;
    }

    public static async getPricelist () {
        return await PriceListRepo.getPriceList()
    }

    public static async addPricelist (pl: any) {
        return await PriceListRepo.addPL(pl)
    }

    public static async editPricelist (id: number, pl: any) {
        return await PriceListRepo.updatePL(id, pl)
    }

    public static async removePricelist (id: number) {
        return await PriceListRepo.delete(id)
    }
        


// let priceUnit: { [s: string]: any } = numberOfNights <= 7
//     ? price.nights_price.find((p: {}) => parseInt(Object.keys(p)[0]) === numberOfNights)
//     : price.nights_price[price.nights_price.length - 1]

// if (month1 === month2) return parseInt(Object.values(priceUnit)[0]) * numberOfNights
// else {
//     let pricesMonth2 = pricelist.find(p => p.period_dates.includes(month2) && room.includes(p.room))
//     let priceUnitMonth2: { [s: string]: any } = numberOfNights <= 7
//     ? pricesMonth2.nights_price.find((p: {}) => parseInt(Object.keys(p)[0]) === numberOfNights)
//     : pricesMonth2.nights_price[price.nights_price.length - 1]

//     var firstDay = new Date(date2.getFullYear(), date2.getMonth(), 1);
//     var lastDay = new Date(date1.getFullYear(), date1.getMonth() + 1, 0);
//     let nights1 = Helper.getNumberOfNights(date1, lastDay)
//     let nights2 = Helper.getNumberOfNights(firstDay, date2)

//     return parseInt(Object.values(priceUnit)[0]) * nights1 + parseInt(Object.values(priceUnitMonth2)[0]) * nights2                    

       
}
