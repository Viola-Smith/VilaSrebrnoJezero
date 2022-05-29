
export default class Helper{
    
    public static transforDateRange(dateFrom: string | number | Date, dateTo: string | number | Date){
        if (dateFrom=="" || dateFrom==undefined) {
            if (dateTo=="" || dateTo==undefined) return { $exists: true }
            else return {"$lt": new Date(dateTo)}
        } else {
            if (dateTo=="" || dateTo==undefined) return { "$gte": new Date(dateFrom) }
            else return { "$gte": new Date(dateFrom), "$lt": new Date(dateTo) }
        }
    }

    public static paginate(arr: string | any[], page_number: number, page_size: number){
        return arr.slice((page_number - 1) * page_size, page_number * page_size)
    }

    public static getNumberOfNights(date1: Date, date2: Date) {
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return numberOfNights
    }

}
