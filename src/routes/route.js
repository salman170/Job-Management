const express = require("express")
const router = express.Router();
const { signup, getUser, userLogin,deleteUser } = require("../controller/userController")
const { createJob, updateJob, deleteJob, getPostedJobDetails } = require("../controller/jobController")
const {getJob, applyForJob ,deleteApplication, updateApplication} = require("../controller/applicantController")
const { authentication, authorization } = require("../middlewares/auth")

//<=======================User Api =================================>

router.post('/signup', signup)
router.post('/login', userLogin)
router.get('/getuser/:userId', authentication, getUser)
router.get('/getuser/:userId', authentication, deleteUser)


//<=======================Job Api =================================>

router.post('/createjob', authentication, createJob)
router.get("/getpostedjob", authentication, getPostedJobDetails)
router.put("/updatejob/:jobId",authentication , authorization, updateJob)
router.delete("/deletejob/:jobId",authentication , authorization, deleteJob)

//<=======================Applicant Api =================================>

router.get("/getJob",authentication,getJob )
router.post("/apply", authentication,applyForJob)
router.put("/updateapplication/:applicationId", authentication, updateApplication)
router.delete('/deleteaplication/:applicationId',authentication, deleteApplication)

module.exports = router