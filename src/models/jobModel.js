const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  skills: { type: [String], required: true, trim: true },
  experience: { type: Number, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  details: { type: ObjectId, ref: "user", },
  releasedAt: { type: Date, requried: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model("job", jobSchema);

/*
email: { type: String, require: true, unique: true, trim: true, lowercase: true, },
  companyName: { type: String, require: true, trim: true },
  fname: { type: String, require: true, trim: true  },
  lname: { type: String, require: true, trim: true  },*/
