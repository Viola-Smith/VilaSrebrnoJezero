import express from 'express';
import cors from 'cors';

const mongoose = require('mongoose');

// export const logger = pino({
//     level:  'info' 
// });


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/vilasrebrnojezero');

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('mongo open');
})

var roomRoutes = require('./routes/RoomRoutes');
var reservationRoutes = require('./routes/ReservationRoutes');

app.use('/reservation', reservationRoutes)
app.use('/room', roomRoutes)


app.listen(4000, () => console.log('Express server running on port 4000'));



