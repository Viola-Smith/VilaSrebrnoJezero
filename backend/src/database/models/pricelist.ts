import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// interface Nights_price {
//     [key: number]: number;
// }

let Pricelist = new Schema({
    period: {
        type: String
    },
	period_dates: {
        type: Array
    },
	room: {
        type: String
    },
	nights_price: {
        type: Array
    }
}, {collection:"Pricelist"});



export default mongoose.model('Pricelist', Pricelist);