import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// interface Nights_price {
//     [key: number]: number;
// }

let Pricelist = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
	period_dates: {
        type: Object
    },
	room: {
        type: String
    },
	base_price: {
        type: Number
    }
}, {collection:"Pricelist"});



export default mongoose.model('Pricelist', Pricelist);