const jobModel = require("../models/jobModel")
const applicantModel = require("../models/applicantModel")
const { alphaNumericValid, isValidEmail, isValidObjectId, isValidRequestBody, isValidName, isValidResume, isValidCoverLetter, } = require("../validator/validator")
const aws = require("../aws/aws")




//<=======================Get Applicant Controller =================================>

const getJob = async (req, res) => {
    try {
        const data = req.query

        const page = parseInt(data.page) || 1;

        const limit = parseInt(data.limit) || 5;

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
            if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "Email should be valid" })
            filter.email = data.email
        }

        const filteredJobList = await jobModel.find(filter).select({ isDeleted: 0, deletedAt: 0, }).populate({
            path: 'details', select: { _id: 0, 'cname': 1, 'fname': 1, 'lname': 1 }
        }).skip((page - 1) * limit).limit(limit);

        if (filteredJobList.length === 0) return res.status(404).send({ status: false, message: "No jobs found with this filters" });

        return res.status(200).send({ status: true, message: "Success", count: filteredJobList.length, data: filteredJobList });

    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: false, error: error.message })
    }
}


const applyForJob = async (req, res) => {
    try {
        let data = req.body;

        let files = req.files;

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: 'No Applicant data provided in body' })

        let { fname, lname, email, jobId, resume, coverletter } = data

        if (!jobId) return res.status(403).send({ Status: false, message: "Please provide jobId in body" })

        if (!isValidObjectId(jobId)) return res.status(400).send({ status: false, message: `${jobId}is not in MongoDb objectId format` })

        let jobDetails = await jobModel.findById(jobId)

        if (!jobDetails || jobDetails.isDeleted === true) return res.status(400).send({ status: false, message: "JobId is invalid. No data found" })

        if (!fname) { return res.status(400).send({ status: false, message: "First name is required" }) }

        if (!isValidName(fname)) return res.status(400).send({ status: false, message: "Enter valid First Name" });

        if (!lname) { return res.status(400).send({ status: false, message: "Last name is required" }) }

        if (!isValidName(lname)) return res.status(400).send({ status: false, message: "Enter valid Last name" });

        if (!email) { return res.status(400).send({ status: false, message: "Email is required" }) }

        if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }

        if (files.length == 0) return res.status(400).send({ status: false, message: "Resume and Cover letter is required" });

        if (files && files.length > 0) {
            if (!isValidResume(files[0].mimetype)) { return res.status(400).send({ status: false, message: "Resume Should be of pdf formate" }); }
            if (!isValidCoverLetter(files[1].mimetype)) { return res.status(400).send({ status: false, message: "Cover Letter Should be of Markdown formate" }); }
        }

        resume = await aws.uploadFile(files[0]);
        data.resume = resume;

        coverletter = await aws.uploadFile(files[1]);
        data.coverletter = coverletter;

        data.userId = req.userId

        const newApplicant = await applicantModel.create(data);

        return res.status(201).send({ status: true, message: 'success', data: newApplicant })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }
}

const updateApplication = async (req, res) => {
    try {

        let applicationId = req.params.applicationId;

        if (!applicationId) return res.status(400).send({ status: false, message: "applicationId is required in path params", });

        if (!isValidObjectId(applicationId)) return res.status(400).send({ status: false, message: `${userId} is Invalid UserId ` });

        let appData = await applicantModel.findById(applicationId)

        if (!appData) return res.status(404).send({ status: false, message: "No data found." })

        if (appData.userId != req.userId) return res.status(403).send({ status: false, message: "Unauthorized access!" });

        let data = req.body;

        let files = req.files;

        if (!isValidRequestBody(data) && files.length == 0) return res.status(400).send({ status: false, message: 'No Applicant data provided in body for update' })

        let { fname, lname, email, jobId, isDeleted } = data

        const filter = { isDeleted: false }

        if (jobId) {
            if (!jobId) return res.status(403).send({ Status: false, message: "Please provide jobId in body" })

            if (!isValidObjectId(jobId)) return res.status(400).send({ status: false, message: `${jobId}is not in MongoDb objectId format` })

            let jobDetails = await jobModel.findById(jobId)

            if (!jobDetails) return res.status(400).send({ status: false, message: "JobId is invalid. No data found" })

            filter.jobId = jobId
        }

        if (fname) {
            if (!fname) { return res.status(400).send({ status: false, message: "First name is required" }) }

            if (!isValidName(fname)) return res.status(400).send({ status: false, message: "Enter valid First Name" });

            filter.fname = fname
        }

        if (lname) {
            if (!lname) { return res.status(400).send({ status: false, message: "Last name is required" }) }

            if (!isValidName(lname)) return res.status(400).send({ status: false, message: "Enter valid Last name" });
            filter.lname = lname
        }
        if (email) {
            if (!email) { return res.status(400).send({ status: false, message: "Email is required" }) }

            if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }
            filter.email = email
        }
        if (isDeleted == "true") filter.isDeleted = true
        else if (isDeleted == "false") filter.isDeleted = false

            if (files && files.length > 0) {
                if (files.length == 2) {
                    if (!isValidResume(files[0].mimetype)) { return res.status(400).send({ status: false, message: "Resume Should be of pdf formate" }); }

                    if (!isValidCoverLetter(files[1].mimetype)) { return res.status(400).send({ status: false, message: "Cover Letter Should be of Markdown formate" }); }

                    resume = await aws.uploadFile(files[0]);
                    filter.resume = resume;

                    coverletter = await aws.uploadFile(files[1]);
                    filter.coverletter = coverletter;

                } else if (files.length == 1) {
                    if (isValidResume(files[0].mimetype)) {

                        resume = await aws.uploadFile(files[0]);
                        filter.resume = resume;
                    } else if (isValidCoverLetter(files[0].mimetype)) {

                        coverletter = await aws.uploadFile(files[0]);
                        filter.coverletter = coverletter;
                    } else return res.status(400).send({ status: false, message: "Resume Should be of pdf formate or Cover letter should be in markdown format" });

                }
            }

        const updateApplicant = await applicantModel.findByIdAndUpdate(applicationId, { $set: filter }, { new: true });

        return res.status(201).send({ status: true, message: 'success', data: updateApplicant })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }
}

const deleteApplication = async (req, res) => {
    try {
        let applicationId = req.params.applicationId;

        if (!applicationId) return res.status(400).send({ status: false, message: "applicationId is required in path params", });

        if (!isValidObjectId(applicationId)) return res.status(400).send({ status: false, message: `${userId} is Invalid UserId ` });

        let appData = await applicantModel.findById(applicationId)

        if (!appData || appData.isDeleted === true) return res.status(404).send({ status: false, message: "No data found." })
        // console.log(appData, req.userId)

        if (appData.userId != req.userId) return res.status(403).send({ status: false, message: "Unauthorized access!" });

        await applicantModel.findByIdAndUpdate(applicationId,
            { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(200).send({ status: true, message: "User data is successfully deleted" })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { getJob, applyForJob, deleteApplication, updateApplication }