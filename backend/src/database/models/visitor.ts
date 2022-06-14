import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Visitor = new Schema({
    uuid: {
        type: String
    },
    reserved: {
        type: Boolean
    }
}, {collection:"Visitor"});



export default mongoose.model('Visitor', Visitor);