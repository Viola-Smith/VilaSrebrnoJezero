import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let GoogleCalendarTokens = new Schema({
    token:{
        type: Object
    }
    
}, {collection:"GoogleCalendarTokens"});



export default mongoose.model('GoogleCalendarTokens', GoogleCalendarTokens);


