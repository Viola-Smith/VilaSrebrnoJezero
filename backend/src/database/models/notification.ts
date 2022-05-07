import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Notification = new Schema({
    id:{
        type: Number
    },
    text:{
        type: String
    },
    subject:{
        type: String
    },
    type:{
        type: String
    },
    sendTo:{
        type: String
    },
}, {collection:"Notification"});



export default mongoose.model('Notification', Notification);


