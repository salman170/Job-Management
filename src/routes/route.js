const express = require("express")
const router = express.Router();
const { signup, getUser, userLogin} = require("../controller/userController")
const {authentication} = require("../middlewares/auth")

//<=======================User Api =================================>

router.post('/signup',signup)

router.post('/login' , userLogin)

router.get('/getUser', authentication, getUser)


//<=======================Job Api =================================>




module.exports = router