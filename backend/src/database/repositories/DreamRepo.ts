// import Helper from '../../helpers/Helper';
// import Dream from '../models/dream';

// export default class DreamRepo {


//     public static async findLastId(){
//         let lastId=1
//         let lastEl =  await Dream.find().sort({"id":-1}).limit(1)
//         if(lastEl.length>0) lastId = lastEl[0].get('id')+1
//         return lastId
//     }

//     public static async createDream(dreamInfo){
//         var obj = {id:await this.findLastId(), title: dreamInfo.title, description: dreamInfo.description, date: dreamInfo.date, type: dreamInfo.type}
//         let newDream = new Dream(obj);

//         return await Dream.collection.insertOne(newDream)
//     }

//     public static async getAllDreams(){
//         return await Dream.find().exec()
//     }

//     public static async getDream(id){
//         return await Dream.findOne({"id":id}).exec()
//     }

//     public static async updateDream(id: number, newDream){
//         return await Dream.findOneAndUpdate({"id":id}, newDream, { new: true }).exec()
//     }

//     public static async deleteDream(id:number){
//         return await Dream.findOneAndDelete({"id":id})
//     }


//     public static async searchDreams(title, type, dateFrom,dateTo){
//         if(title=="" || title==undefined) title= { $exists: true }
//         else title= {'$regex': title, '$options' : 'i'}
//         if(type=="" || type==undefined) type= { $exists: true }

//         let dateComparison:any = Helper.transforDateRange(dateFrom, dateTo)
        
//         return await Dream.collection.aggregate([
//             { "$addFields": {
//               "date2": {
//                 "$dateFromString": {
//                   "dateString": "$date"
//                 }
//               }
//             }},
//             { "$match": { $and: [
//                 { "date2": dateComparison },
//                 {"title": title},
//                 {"type": type}
//             ] }}   
         
//           ]).toArray()

//     }

// }