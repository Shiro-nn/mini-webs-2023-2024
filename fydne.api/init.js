const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./modules/logger');

mongoose.set('strictQuery', false);
mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    logger.log('Connected to the Mongodb database');
    require('./web')();
}).catch((err) => {
    console.log(err)
    logger.error('Unable to connect to the Mongodb database. Error: ' + err);
});

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));