import Helper from "../helpers/Helper";
import PriceListRepo from "../database/repositories/PriceListRepo";
import RatePlanRepo from "../database/repositories/RatePlanRepo";
import Service from "./Service";



export default class PricelistService extends Service {
    protected repo = new PriceListRepo()
    protected name = 'prices'

    public async calculatePrice(dateFrom: string, dateTo: string, room: string) {
        let pricelist = await super.getAll()
        let date1 = new Date(dateFrom)
        let date2 = new Date(dateTo)

        var numberOfNights = Helper.getNumberOfNights(date2, date1)

        let totalPrice = 0
        let currentDate = new Date(dateFrom);
        while (currentDate < date2) {
            let prices = pricelist.filter((p:any) =>
                currentDate >= new Date(p.period_dates.date_from) &&
                currentDate <= new Date(p.period_dates.date_to) &&
                room.includes(p.room)
            )
            
            let price = prices.length ? prices[prices.length - 1] : null
            if (price) {
                if (numberOfNights > 0) {
                    totalPrice += price.base_price
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    

        let ratePlan = await (new RatePlanRepo()).getRatePlanByNights(numberOfNights)
        if (ratePlan) {
            let modification = ratePlan.percent ? (ratePlan.base_price_mod/100)*totalPrice : ratePlan.base_price_mod*numberOfNights
            if (modification) {
                if (ratePlan.subtract === true) {
                    totalPrice -= modification
                } else if (ratePlan.subtract === false) {
                    totalPrice += modification
                }
            }
        }

        return totalPrice;
    }

    public async addPricelist (pls: any) {
        for (let index = 0; index < pls.length; index++) {
            try{
                let foundPl = await this.repo.getPriceListByDateRangeAndRoom(pls[index].period_dates.date_from, pls[index].period_dates.date_to, pls[index].room)
                console.log(foundPl)
                for (let i = 0; i < foundPl.length; i++) {
                    await super.delete(foundPl[i].id)
                }
                await super.add(pls[index])
            } catch (e) {
                console.log(e)
                return {'message': 'Failed to change prices'}
            }
        }
        return {'message': 'Succesfully changed prices'}
    }

    public async addPricelists (pls: any) {
        for (let index = 0; index < pls.length; index++) {
            console.log(pls[index])
            try{
                let foundPl = await this.repo.getPriceListByDateAndRoom(pls[index].period_dates.date_from, pls[index].period_dates.date_to, pls[index].room)
                if (foundPl.length === 0) {
                    await super.add(pls[index])
                } else {
                    pls[index].id = foundPl[0].id
                    await super.update(foundPl[0].id, pls[index])
                }
            } catch (e) {
                console.log(e)
                return {'message': 'Failed to change prices'}
            }
        }
        return {'message': 'Succesfully changed prices'}
    }

    public async getPricelistByRoom(room:any) {
        return await this.repo.getPriceListByRoom(room)
    }

    public async getAll() {
        let allPl = await super.getAll()
        allPl.sort(function(a:any,b:any){
            return new Date(a.period_dates.date_from).getTime() - new Date(b.period_dates.date_from).getTime();
        });
        return allPl
    }
       
}
