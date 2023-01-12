const jobModel = require("../models/jobModel")
const applicantModel = require("../models/applicantModel")
const { isValidRequestBody, alphaNumericValid, isValidEmail } = require("../validator/validator")
const moment = require("moment")


//<=======================Create Job Controller =================================>

const createJob = async (req, res) => {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: 'No Job data provided in body' })

    let { title, skills, experience, description ,email} = data

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

    data.details = req.userId

    data.postedAt = moment(new Date()).format('DD-MM-YYYY')

    const newUser = await (await jobModel.create(data)).populate({
      path: 'details', select: { _id: 0, 'cname': 1, 'fname': 1, 'lname': 1 }
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

    for (let i = 0; i < jobData.length; i++) {
      dataJ.push(jobData[i].toObject())
      let applicantData = await applicantModel.find({ jobId: dataJ[i]._id })
      if (applicantData.length > 0) {
        dataJ[i].applicantDetails = applicantData
      } else dataJ[i].applicantDetails = "No application submmitted"
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

    let { title, skills, experience, description, isDeleted, ...rest } = data

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

      filter.experience = experience.trim()
    }
    if (isDeleted == true || isDeleted == false) {
      filter.isDeleted = isDeleted
    }

    filter.postedAt = moment(new Date()).format('DD-MM-YYYY')

    const updateJob = await jobModel.findByIdAndUpdate(req.params.jobId, { $set: filter }).populate({
      path: 'details', select: { _id: 0, 'cname': 1, 'fname': 1, 'lname': 1 }
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
    if (!req.jobdata.isDeleted === true) return res.status(404).send({ status: false, message: "No data found." })

    await studentModel.findOneAndUpdate({ _id: req.params.jobId },
      { $set: { isDeleted: true, deletedAt: new Date() } })

    res.status(200).send({ status: true, message: "Student data is successfully deleted" })

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = { createJob, updateJob, deleteJob, getPostedJobDetails }