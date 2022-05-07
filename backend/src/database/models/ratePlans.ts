import mongoose from 'mongoose';

const Schema = mongoose.Schema;


let RatePlan = new Schema({
    id: {
        type: Number
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
    }
}, {collection:"RatePlan"});



export default mongoose.model('RatePlan', RatePlan);