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
    extra_beds_price: {
        type: Array
    },
	bookable: {
        type: Boolean
    },
    bookable_periods: {
        type: Array
    }
}, {collection:"Room"});



export default mongoose.model('Room', Room);