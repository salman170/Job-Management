const express = require("express")
const router = express.Router();
const { signup, getUser, userLogin } = require("../controller/userController")
const { createJob, updateJob, deleteJob, getPostedJobDetails } = require("../controller/jobController")
const { authentication, authorization } = require("../middlewares/auth")

//<=======================User Api =================================>

router.post('/signup', signup)
router.post('/login', userLogin)
router.get('/getuser/:userId', authentication, getUser)


//<=======================Job Api =================================>

router.post('/createjob', authentication, createJob)
router.get("/getpostedjob", authentication, getPostedJobDetails)
router.put("/updatejob/:jobId",authentication , authorization, updateJob)
router.delete("/deletejob/:jobId",authentication , authorization, deleteJob)

//<=======================Applicant Api =================================>

module.exports = router