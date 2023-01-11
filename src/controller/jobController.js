const jobModel = require("../models/jobModel")
const { isValidRequestBody, alphaNumericValid} = require("../validator/validator")

const signup = async function (req, res) {
    try {
      let data = req.body;
  
      if (!isValidRequestBody(data)) { return res.status(400).send({ status: false, message: 'No Job data provided in body' }) }
  
      //validations
  
      let { title, skills, experience, description} = data
  
      if (!title) { return res.status(400).send({ status: false, message: "Title is required" }) }
  
      if (!alphaNumericValid(title)) { return res.status(400).send({ status: false, msg: "Use proper title e.g Mr or Mrs or Miss " }) }
  
      if (!skills) { return res.status(400).send({ status: false, message: "skills is mandatory" }) }
  
      if (!alphaNumericValid(skills)) return res.status(400).send({ status: false, message: "Enter valid skills" });
  
      if (!description) { return res.status(400).send({ status: false, message: "Description is required" }) }
  
      if (!alphaNumericValid(description)) return res.status(400).send({ status: false, message: "Enter valid description" });
  
      if (!email) { return res.status(400).send({ status: false, message: "Email is required" }) }
  
      if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }
  
      if (await userModel.findOne({ email: email })) { return res.status(400).send({ status: false, message: `User already exist with this ${email}` }) }
  
      if (!password) { return res.status(400).send({ status: false, message: "Password is required" }) }
  
      if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password is not in correct format(length should be from 8-15)" })
  
      if (!cname) { return res.status(400).send({ status: false, message: "Company Name is required" }) }
  
      if (!isValidCompany(cname)) return res.status(400).send({ status: false, message: "Enter valid Company Name" });
  
      //encrypting password
      const saltRounds = 10;
      hash = await bcrypt.hash(password, saltRounds);
  
      data.password = hash;
  
      const newUser = await userModel.create(data);
  
      return res.status(201).send({ status: true, message: 'success', data: newUser })
  
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ message: error.message });
    }
  };