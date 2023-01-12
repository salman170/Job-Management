const express = require("express")
const router = express.Router();
const { signup, getUser, userLogin} = require("../controller/userController")
const {createJob}= require("../controller/jobController")
const {authentication} = require("../middlewares/auth")

//<=======================User Api =================================>

router.post('/signup',signup)

router.post('/login' , userLogin)

router.get('/getUser', authentication, getUser)


//<=======================Job Api =================================>

router.post('/createjob', authentication,createJob)


module.exports = router