import ReservationRepo from "../database/repositories/ReservationRepo";
import PricelistService from "./PricelistService";



export default class ReservationService{

    public static async getAvailable(dateFrom: any, dateTo: any, adults: any, kids: any){
        try{
            let arr =  await ReservationRepo.getAvailable(dateFrom, dateTo, adults, kids)
            // let page_number = Number(page)
            // let page_size = Number(pageSize)

            // logger.info('Searched for dreams')
            // logger.debug('Searched with parameters: title = '+title+', type= '+type+', date1= '+dateFrom+', date2='+ dateTo
            //     +' , page number = '+page_number+', page size = '+page_size)

            //if(isNaN(page_number)  ||  isNaN(page_size) ) return arr
            // if(isNaN(page_number)) page_number =1
            // if(isNaN(page_size)) page_size=2

            // return Helper.paginate(arr,page_number,page_size)
        }catch(err){
            // logger.error(new Error("Search dreams failed"), err)
            return {"error message": err}
        }
        
    }

    public static async book(reservationObject: any) {
        let price = await PricelistService.calculatePrice(reservationObject.date_from, reservationObject.date_to, reservationObject.room.name)
        if (price) {
            reservationObject.price = price
            delete reservationObject.timestamp
            try {
                let outcome =  await ReservationRepo.book(reservationObject)
                if (outcome) {
                    return {'message': 'Sucessfully inserted reservation', 'new': outcome}
                } else {
                    return {'message': 'Failed to insert reservation', 'new': null}
                }
            } catch (err) {
                return {'message': err, 'new': null as Object}
            }
        }       
    }

    public static async getAll() {
        return await ReservationRepo.getAllReservations();
    }

}