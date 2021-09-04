import express from 'express';
import cors from 'cors';

// export const logger = pino({
//     level:  'info' 
// });


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/dreams');

// const connection = mongoose.connection;

// connection.once('open', ()=>{
//     logger.info('mongo open');
// })


// var routeType = require('./routes/DreamTypeRoutes');
// var dreamRoutes = require('./routes/DreamRoutes');
// var searchRoutes = require('./routes/DreamSearchRoutes');

// app.use('/', routeType)
// app.use('/dream', dreamRoutes)
// app.use('/search', searchRoutes)

const Sequelize = require('sequelize');

// connect db
const connection = new Sequelize("vilasrebrnojezero", "root", "Betonija1", {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

module.exports = { Sequelize : Sequelize, sequelize : connection }

const { RoomType } = require('./database/models/roomType');


connection
    .authenticate()
    .then(async () => {


        const users = await RoomType.findAll();

        console.log(JSON.stringify(users))

        console.log('Connection has been established successfully.');

        app.listen(4000, () => console.log('Express server running on port 4000'));


    })
    .catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });

