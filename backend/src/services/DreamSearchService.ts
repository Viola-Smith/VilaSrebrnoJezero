// import Helper from "../helpers/Helper";
// import DreamRepo from "../database/repositories/DreamRepo";
// import DreamTypeService from "./DreamTypeService";
// import { logger } from "../server";



// export default class DreamSearchService{

//     public static async search(title, type, dateFrom, dateTo, page, pageSize){
//         type = DreamTypeService.getDreamTypeName(type)
//         try{
//             let arr =  await DreamRepo.searchDreams(title, type, dateFrom, dateTo)
//             let page_number = Number(page)
//             let page_size = Number(pageSize)

//             logger.info('Searched for dreams')
//             logger.debug('Searched with parameters: title = '+title+', type= '+type+', date1= '+dateFrom+', date2='+ dateTo
//                 +' , page number = '+page_number+', page size = '+page_size)

//             //if(isNaN(page_number)  ||  isNaN(page_size) ) return arr
//             if(isNaN(page_number)) page_number =1
//             if(isNaN(page_size)) page_size=2

//             return Helper.paginate(arr,page_number,page_size)
//         }catch(err){
//             logger.error(new Error("Search dreams failed"), err)
//             return {"error message": err}
//         }
        
//     }

// }