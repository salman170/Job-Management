const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const applicantSchema = new mongoose.Schema({
    fname: { type: String, require: true, trim: true },
    lname: { type: String, require: true, trim: true },
    email: { type: String, required: true, trim: true },
    jobId: { type: ObjectId, ref: "job", },
    resume: { type: String, required: true, trim: true },
    coverletter: { type: String, required: true, trim: true },
    userId: { type: ObjectId, ref: "user", },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}
)


module.exports = mongoose.model("Applicant", applicantSchema)