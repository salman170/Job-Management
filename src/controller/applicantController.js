const jobModel = require("../models/jobModel")
const applicantModel = require("../models/applicantModel")
const { alphaNumericValid, isValidEmail, isValidObjectId ,isValidRequestBody} = require("../validator/validator")
const aws = require("../aws/aws")




//<=======================Get Applicant Controller =================================>

const getJob = async (req, res) => {
    try {
        const data = req.query

        if (Object.keys(data).length === 0) {
            const allJobs = await job.find()
            return res.status(200).send({ status: true, message: "All Jobs", count: allJobs.length, data: allJobs })
        }

        let { title, skills, experience, email } = data

        const filter = { isDeleted: false }

        if (skills) {
            if (!alphaNumericValid(data.skills)) return res.status(400).send({ status: false, message: "skills should be valid string" })
            const str = new RegExp(data.skills, 'i')
            filter.skills = { $regex: str }
        }

        if (experience) {
            if (!alphaNumericValid(data.experience)) return res.status(400).send({ status: false, message: "experience should be valid string" })
            const str = new RegExp(data.experience, 'i')
            filter.experience = { $regex: str }
        }

        if (title) {
            if (!alphaNumericValid(data.title)) return res.status(400).send({ status: false, message: "title should be valid string" })
            const str = new RegExp(data.title, 'i')
            filter.title = { $regex: str }
        }

        if (email) {
            if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "email should be valid" })
            filter.email = data.email
        }

        const allPosting = await job.find(filter).select({ isDeleted: 0, deletedAt: 0, })
        if (allPosting.length === 0) return res.status(404).send({ status: false, message: "No jobs found, come later" });

        return res.status(200).send({ status: true, message: "Success", count: allPosting.length, data: allPosting });

    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: false, error: error.message })
    }
}


const applyForJob = async (req, res) => {
    try {
        let jobId = req.params.jobId

        if (!jobId) return res.status(403).send({ Status: false, message: "Please provide jobId in path param " })

        if (!isValidObjectId(jobId)) return res.status(400).send({ status: false, message: `${jobId}is not in MongoDb objectId format` })

        let jobDetails = await jobModel.findById(jobId)

        if (!jobDetails) return res.status(400).send({ status: false, message: "JobId is invalid. No data found" })

        let data = req.body;

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: 'No Applicant data provided in body' })


    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }
}



module.exports = { getJob, applyForJob }