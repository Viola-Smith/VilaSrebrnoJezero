import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Room = new Schema({
    id:{
        type:Number
    },
    name: {
        type: String
    },
	floor: {
        type: Number
    },
	adults: {
        type: Number
    },
	extra_beds: {
        type: Number
    },
	view: {
        type: Boolean
    }
}, {collection:"Room"});



export default mongoose.model('Room', Room);