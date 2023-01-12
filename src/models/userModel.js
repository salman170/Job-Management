const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    fname: { type: String, require: true, trim: true },
    lname: { type: String, require: true, trim: true },
    email: { type: String, require: true, unique: true, trim: true, lowercase: true },
    cname: { type: String, require: true, trim: true },
    password: { type: String, require: true, trim: true }
}, { timestamps: true }
)

module.exports = mongoose.model("user", userSchema)