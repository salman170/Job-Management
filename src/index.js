const express = require('express');
const route = require('./routes/route.js');
const app = express();
const mongoose = require('mongoose')
const multer = require('multer')
require('dotenv').config()

app.use(express.json());
app.use(multer().any())
// multer will be used to get access to the file in nodejs

mongoose.connect(process.env.MONGO_CLUSTER, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB Database'))
    .catch(err => console.log(`Error-Connecting to DB${err}`));

app.use('/', route);

app.use("/*", function (req, res) {
    return res.status(400).send({ status: false, message: "invalid request params (path not found)" })
});

app.listen((process.env.PORT || 3000), function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
