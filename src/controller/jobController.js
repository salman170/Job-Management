const jobModel = require("../models/jobModel")
const applicantModel = require("../models/applicantModel")
const { isValidRequestBody, alphaNumericValid, isValidEmail, isValidCompany } = require("../validator/validator")
const moment = require("moment")


//<=======================Create Job Controller =================================>

const createJob = async (req, res) => {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: 'No Job data provided in body' })

    let { title, skills, experience, description, email, cname } = data

    if (!title) { return res.status(400).send({ status: false, message: "Title is required" }) }

    if (!alphaNumericValid(title)) return res.status(400).send({ status: false, msg: "Enter valid title" })

    if (!skills) { return res.status(400).send({ status: false, message: "skills is mandatory" }) }

    if (!alphaNumericValid(skills)) return res.status(400).send({ status: false, message: "Enter valid skills" });

    if (!description) { return res.status(400).send({ status: false, message: "Description is required" }) }

    if (!alphaNumericValid(description)) return res.status(400).send({ status: false, message: "Enter valid description" });

    if (!experience) { return res.status(400).send({ status: false, message: "experience is required" }) }

    if (!alphaNumericValid(experience)) return res.status(400).send({ status: false, message: "Enter valid experience details" });

    if (!email) { return res.status(400).send({ status: false, message: "Email is required" }) }

    if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }

    if (!cname) { return res.status(400).send({ status: false, message: "Company Name is required" }) }

    if (!isValidCompany(cname)) return res.status(400).send({ status: false, message: "Enter valid Company Name" });

    data.details = req.userId

    data.postedAt = moment(new Date()).format('DD-MM-YYYY')

    const newUser = await (await jobModel.create(data)).populate({
      path: 'details', select: { _id: 0, 'fname': 1, 'lname': 1 }
    })

    return res.status(201).send({ status: true, message: 'success', data: newUser })

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};


//<=======================Get Applicant Controller =================================>

const getPostedJobDetails = async (req, res) => {
  try {

    let userId = req.userId

    let jobData = await jobModel.find({ details: userId })

    if (jobData.length == 0) return res.status(404).send({ status: false, message: "No data found." })

    let dataJ = []

    let applicantData = await applicantModel.find({ isDeleted: false }).select({isDeleted:0,_id:0,deletedAt:0,__v:0})

    for (let i = 0; i < jobData.length; i++) {
      let applicant = []
      dataJ.push(jobData[i].toObject())
      for (let j in applicantData) {
        dataJ[i].applicantDetails = "No application submmitted"
        if (applicantData[j].jobId.toString() === dataJ[i]._id.toString()) {
          applicant.push(applicantData[j])
        }
      }
      if (applicant.length > 0) dataJ[i].applicantDetails = applicant
    }

    return res.status(200).send({ status: true, message: "Applicant List", data: dataJ })
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
}


//<=======================Update Job Details Controller =================================>

const updateJob = async (req, res) => {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: 'No Job data provided in body for Update' })

    let { title, skills, experience, description, isDeleted, email, cname, ...rest } = data

    if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not update these:-( ${Object.keys(rest)} ) data ` })

    const filter = { isDeleted: false }

    if (title) {
      if (!alphaNumericValid(title)) return res.status(400).send({ status: false, msg: "Enter valid title" })

      filter.title = title.trim()
    }
    if (skills) {
      if (!alphaNumericValid(skills)) return res.status(400).send({ status: false, msg: "Enter valid skills" })

      filter.skills = skills.trim()
    }
    if (description) {
      if (!alphaNumericValid(description)) return res.status(400).send({ status: false, msg: "Enter valid description" })

      filter.description = description.trim()
    }
    if (experience) {
      if (!alphaNumericValid(experience)) return res.status(400).send({ status: false, msg: "Enter valid experience details" })

      filter.experience = experience
    }
    if (email) {
      if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }

      filter.email = email
    }
    if (cname) {

      if (!isValidCompany(cname)) return res.status(400).send({ status: false, message: "Enter valid Company Name" });

      filter.cname = cname
    }
    if (isDeleted == true || isDeleted == false) {
      filter.isDeleted = isDeleted
    }

    filter.postedAt = moment(new Date()).format('DD-MM-YYYY')

    const updateJob = await jobModel.findByIdAndUpdate(req.params.jobId, { $set: filter }, { new: true }).populate({
      path: 'details', select: { _id: 0, 'fname': 1, 'lname': 1 }
    })

    if (!updateJob) return res.status(404).send({ status: false, message: "No Job found" })

    return res.status(200).send({ status: true, message: "updated successfully", data: updateJob })
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
}


//<=======================Delete Job Controller =================================>

const deleteJob = async (req, res) => {
  try {

    if (req.jobdata.isDeleted === true) return res.status(404).send({ status: false, message: "No data found." })

    await jobModel.findByIdAndUpdate(req.params.jobId,
      { $set: { isDeleted: true, deletedAt: new Date(), postedAt: "" } })

    res.status(200).send({ status: true, message: "Job data is successfully deleted" })

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = { createJob, updateJob, deleteJob, getPostedJobDetails }