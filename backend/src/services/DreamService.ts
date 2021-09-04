
// import moment from 'moment';
// import { logger } from '../server';
// import DreamRepo from '../database/repositories/DreamRepo'
// import DreamTypeService from './DreamTypeService';



// export default class DreamService{

//     public static async createDream(dreamInfo){
//         if(dreamInfo.title==undefined || dreamInfo.title=="" ) {
//             logger.error(new Error("Create query failed"), "Title not defined")
//             return {"error message": "Title not defined"}
//         }

//         if(dreamInfo.date==undefined || dreamInfo.date=="") dreamInfo.date= moment().format("YYYY-MM-DD");
//         else if(!moment(dreamInfo.date, "YYYY-MM-DD", true).isValid() ) {
//             logger.error(new Error("Create query failed"), "The date is not in right format")
//             return {"error message": "The date is not in the right format"}
//         }
//         if(dreamInfo.type==undefined || dreamInfo.type=="") dreamInfo.type=0    
//         else if(!DreamTypeService.isValidType(dreamInfo.type)) {
//             logger.error(new Error("Create query failed"), "The dream type is not valid")
//             return {"error message": "The dream type is not valid"}
//         } 
        
//         if(dreamInfo.description==undefined) dreamInfo.description=""
        
//         try{
//             dreamInfo.type = DreamTypeService.getDreamTypeName(dreamInfo.type)
//             let res = await DreamRepo.createDream(dreamInfo)
//             logger.info('Created a dream with id '+res.ops[0].id)
//             return res.ops[0]
//         }catch(err){
//             logger.error(new Error("Create query failed"), err)
//             return {"error message": err}
//         }
//     }

//     public static async getAllDreams(){
//         try{
//             let dreams =  await DreamRepo.getAllDreams()
//             logger.info('Got all dreams')
//             return dreams
//         }catch(err){
//             logger.error(new Error("Get all dreams failed"), err)
//             return {"error message": err}
//         }
//     }

//     public static async findDream(id:number){
//         if(isNaN(id)) {
//             logger.error(new Error("Get a dream failed"), "Id was not a number")
//             return {"error message": "Id was not a number"}
//         }
//         try{
//             let dream =  await DreamRepo.getDream(id)
//             logger.info('Got a dream with id '+id)
//             return dream
//         }catch(err){
//             logger.error(new Error("Get a dream failed with id "+id), err)
//             return {"error message": err}
//         }
//     }

//     public static async updateDream(id:number, newDream){
//         if(isNaN(id)){
//             logger.error(new Error("Update a dream failed"), "Id was not a number")
//             return {"error message": "Id was not a number"}
//         }  
//         newDream.type = DreamTypeService.getDreamTypeName(newDream.type)
//         try{
//             let updatedDream =  await DreamRepo.updateDream(id, newDream)
//             if(updatedDream) logger.info('Updated a dream with id '+id)
//             return updatedDream
//         }catch(err){
//             logger.error(new Error("Update a dream failed with id "+id), err)
//             return {"error message": err}
//         }
//     }


//     public static async deleteDream(id:number){
//         if(isNaN(id)){
//             logger.error(new Error("Delete a dream failed"), "Id was not a number")
//             return {"error message": "Id was not a number"}
//         } 
//         try{
//             let deletedDream =  await DreamRepo.deleteDream(id)
//             if(deletedDream) logger.info('Deleted a dream with id '+id)
//             return deletedDream
//         }catch(err){
//             logger.error(new Error("Delete a dream failed with id "+id), err)
//             return {"error message": err}
//         }
//     }



// }