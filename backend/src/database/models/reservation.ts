import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Reservation = new Schema({
    id:{
        type:Number
    },
    date_from: {
        type: Date
    },
	date_to: {
        type: Date
    },
	room: {
        type: Number
    },
	name: {
        type: String
    },
	user_id: {
        type: Number
    },
	price: {
        type: Number
    },
	payed: {
        type: Number
    },
	notes: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now 
    }
}, {collection:"Reservation"});



export default mongoose.model('Reservation', Reservation);