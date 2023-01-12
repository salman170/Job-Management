const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    fname: { type: String, require: true, trim: true },
    lname: { type: String, require: true, trim: true },
    email: { type: String, require: true, unique: true, trim: true, lowercase: true },
    password: { type: String, require: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true }
)

module.exports = mongoose.model("user", userSchema)