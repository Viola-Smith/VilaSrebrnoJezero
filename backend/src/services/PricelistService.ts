import Helper from "../helpers/Helper";
import PriceListRepo from "../database/repositories/PriceListRepo";



export default class PricelistService {

    public static async calculatePrice(dateFrom: string, dateTo: string, room: string) {
        let pricelist = await PriceListRepo.getPriceList()
        let date1 = new Date(dateFrom)
        let date2 = new Date(dateTo)

        let month1 = date1.toLocaleString('default', { month: 'long' }).toLowerCase();
        let month2 = date2.toLocaleString('default', { month: 'long' }).toLowerCase();

        var numberOfNights = Helper.getNumberOfNights(date2, date1)

        let prices = pricelist.find(p => p.period_dates.includes(month1) && room.includes(p.room))
        if (prices) {
            if (numberOfNights > 0) {
                let priceUnit: { [s: string]: any } = numberOfNights <= 7
                    ? prices.nights_price.find((p: {}) => parseInt(Object.keys(p)[0]) === numberOfNights)
                    : prices.nights_price[prices.nights_price.length - 1]

                if (month1 === month2) return parseInt(Object.values(priceUnit)[0]) * numberOfNights
                else {
                    let pricesMonth2 = pricelist.find(p => p.period_dates.includes(month2) && room.includes(p.room))
                    let priceUnitMonth2: { [s: string]: any } = numberOfNights <= 7
                    ? pricesMonth2.nights_price.find((p: {}) => parseInt(Object.keys(p)[0]) === numberOfNights)
                    : pricesMonth2.nights_price[prices.nights_price.length - 1]

                    var firstDay = new Date(date2.getFullYear(), date2.getMonth(), 1);
                    var lastDay = new Date(date1.getFullYear(), date1.getMonth() + 1, 0);
                    let nights1 = Helper.getNumberOfNights(date1, lastDay)
                    let nights2 = Helper.getNumberOfNights(firstDay, date2)

                    return parseInt(Object.values(priceUnit)[0]) * nights1 + parseInt(Object.values(priceUnitMonth2)[0]) * nights2                    

                }
            }
        }
        return null
    }
}