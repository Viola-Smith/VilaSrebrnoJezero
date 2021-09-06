import PriceListRepo from "../database/repositories/PriceListRepo";



export default class PricelistService {

    public static async calculatePrice(dateFrom: string, dateTo: string, room: string) {
        let pricelist = await PriceListRepo.getPriceList()
        let date1 = new Date(dateFrom)
        let date2 = new Date(dateTo)

        let month1 = date1.toLocaleString('default', { month: 'long' }).toLowerCase();
        let month2 = date2.toLocaleString('default', { month: 'long' }).toLowerCase();

        let prices = pricelist.find(p => p.period_dates.includes(month1) && room.includes(p.room))
        if (prices) {
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (numberOfNights > 0) {
                let priceUnit : {[s: string]: any} = numberOfNights <= 7 
                ? prices.nights_price.find((p: {}) => parseInt(Object.keys(p)[0]) === numberOfNights) 
                : prices.nights_price[prices.nights_price.length - 1]
               
                return parseInt(Object.values(priceUnit)[0]) * numberOfNights
            }
        }
        return null
    }
}