// import { DreamType } from "../database/models/dream"

// export default class DreamTypeService{

//     public static getAllDreamTypes(){
//         var values = Object.keys(DreamType).filter(d=>isNaN(Number(d)))
//         return values
//     }

//     public static getDreamTypeName(index:number){
//         return this.getAllDreamTypes()[index]
//     }
    
//     public static isValidType(num){
//         let arrDreamTypes = Array.from(Array(DreamTypeService.getAllDreamTypes().length).keys())
//         return arrDreamTypes.includes(num)
//     }

// }