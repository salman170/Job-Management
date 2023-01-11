const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    jobId: { type: ObjectId, ref: "job", },
    resume: { type: String, required: true, trim: true },
    coverletter: { type: String, required: true, trim: true }
}, { timestamps: true }
)


module.exports = mongoose.model("Applicant", applicantSchema)