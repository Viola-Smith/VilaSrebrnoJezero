import mongoose from 'mongoose';

const Schema = mongoose.Schema;


let RatePlan = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
	minNights: {
        type: Number
    },
	maxNights: {
        type:  Number
    },
	base_price_mod: {
        type: Number
    },
    subtract: {
        type: Boolean
    },
    percent: {
        type: Boolean
    }
}, {collection:"RatePlan"});



export default mongoose.model('RatePlan', RatePlan);