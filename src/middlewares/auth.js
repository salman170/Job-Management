const jobModel = require("../models/jobModel")
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId.isValid


//<=======================Authentication =================================>

const authentication = async (req, res, next) => {
    try {
        let gettingToken = req.headers.authorization

        if (!gettingToken) return res.status(400).send({ status: false, message: "token must be present" });

        const token = gettingToken.substring(7)

        jwt.verify(token, "Asignment by Xhipment", (err, decodedToken) => {
            if (err) return res.status(401).send({ status: false, message: "token is not valid {" + err.message + "}" })
            req.userId = decodedToken.userId
            req.email = decodedToken.email
            next();
        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, message: err.message })
    }
};


//<=======================Authorization =================================>
const authorization = async function (req, res, next) {
    try {
        let jobId = req.params.jobId

        if (!jobId) return res.status(403).send({ Status: false, message: "You are not authorized provide jobId in path param " })

        if (!ObjectId(jobId)) return res.status(400).send({ status: false, message: `${jobId}is not in MongoDb objectId format` })

        let jobDetails = await jobModel.findById(jobId)

        if (!jobDetails) return res.status(400).send({ status: false, message: "bookId is invalid" })

        if (jobDetails.details._id.toString() !== req.userId) return res.status(403).send({ status: false, message: "You are not authorized" })

        req.jobdata = jobDetails

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { authentication, authorization };