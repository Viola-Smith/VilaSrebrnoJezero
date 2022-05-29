import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Integration = new Schema({
    id:{
        type: Number
    },
    name:{
        type: String
    },
    content:{
        type: Object
    },
    enabled: {
        type: Boolean
    },
    imgPath: {
        type: String
    }
    
}, {collection:"Integration"});



export default mongoose.model('Integration', Integration);


