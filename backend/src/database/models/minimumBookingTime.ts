

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let MinimumBookingTime = new Schema({
    date_period:{
        type: Object
    },
    days:{
        type: Number
    },
    rooms: {
        type: Array
    }
    
}, {collection:"MinimumBookingTime"});



export default mongoose.model('MinimumBookingTime', MinimumBookingTime);


