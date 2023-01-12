//<<-----------------------------------------------Importing Modules -------------------------------------------------------->>
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isValidRequestBody, isValidName, isValidEmail, isValidPassword, isValidObjectId } = require("../validator/validator");

//<<-----------------------------------------------Create user-------------------------------------------------------->>
const signup = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) { return res.status(400).send({ status: false, message: 'No User data provided in body' }) }

    //validations

    let { fname, lname, email, password } = data

    if (!fname) { return res.status(400).send({ status: false, message: "First Name is required" }) }

    if (!isValidName(fname)) return res.status(400).send({ status: false, message: "Enter valid First Name" });

    if (!lname) { return res.status(400).send({ status: false, message: "Last name is required" }) }

    if (!isValidName(lname)) return res.status(400).send({ status: false, message: "Enter valid Last name" });

    if (!email) { return res.status(400).send({ status: false, message: "Email is required" }) }

    if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }

    if (await userModel.findOne({ email: email })) { return res.status(400).send({ status: false, message: `User already exist with this ${email}` }) }

    if (!password) { return res.status(400).send({ status: false, message: "Password is required" }) }

    if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password is not in correct format(length should be from 8-15)" })

    //encrypting password
    const saltRounds = 10;
    hash = await bcrypt.hash(password, saltRounds);

    data.password = hash;

    const newUser = await userModel.create(data);

    return res.status(201).send({ status: true, message: 'success', data: newUser })

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-----------------------------------------------user login --------------------------------------------------------

const userLogin = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) { return res.status(400).send({ status: false, message: "No credential provided for login" }); }

    let { email, password } = req.body;

    if (!email) return res.status(400).send({ status: false, message: "EMAIL is required" });

    if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please provide a valid email" });

    if (!password) return res.status(400).send({ status: false, message: "Password is required" });

    if (password.trim().length < 8 || password.trim().length > 15) return res.status(400).send({ status: false, message: "Password should be of minimum 8 characters & maximum 15 characters", });

    const mailMatch = await userModel.findOne({ email: email }).select({ _id: 1, password: 1 });
    if (!mailMatch) return res.status(400).send({ status: false, message: `No data found with this ${email} email.`, });

    const userId = mailMatch._id;
    checkPassword = mailMatch.password;

    const passMatch = await bcrypt.compare(password, checkPassword);

    if (!mailMatch || !passMatch) return res.status(400).send({ status: false, message: "Credential is incorrect." });

    const token = jwt.sign(
      {
        userId: mailMatch._id.toString(),
        iat: new Date().getTime() / 1000,
      }, "Asignment by Xhipment",
      { expiresIn: "2h" }
    );

    res.setHeader("authorization", "token");

    return res.status(200).send({ status: true, message: "You are successfully logged in", data: { userId: userId, token: token }, });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

//<<-----------------------------------------------Get user  -------------------------------------------------------->>
const getUser = async function (req, res) {
  try {
    let userId = req.params.userId;

    if (!userId) return res.status(400).send({ status: false, message: "userId is required in path params", });

    if (!isValidObjectId(userId.trim())) return res.status(400).send({ status: false, message: `${userId} is Invalid UserId ` });

    if (userId != req.userId) return res.status(403).send({ status: false, message: "Unauthorized access!" });

    const userData = await userModel.findById(req.userId);

    if (!userData || userData.isDeleted == true) return res.status(404).send({ status: false, message: `No user data found for this ${userId}`, });

    return res.status(200).send({ status: true, message: "User profile details", data: userData });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (!userId) return res.status(400).send({ status: false, message: "userId is required in path params", });

    if (!isValidObjectId(userId.trim())) return res.status(400).send({ status: false, message: `${userId} is Invalid UserId ` });

    if (userId != req.userId) return res.status(403).send({ status: false, message: "Unauthorized access!" });

    let userData = await userModel.findById(userId)

    if (!userData || userData.isDeleted === true) return res.status(404).send({ status: false, message: "No data found." })

    await userModel.findByIdAndUpdate(req.userId,
      { $set: { isDeleted: true, deletedAt: new Date() } })

    res.status(200).send({ status: true, message: "User data is successfully deleted" })

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ status: false, message: error.message })
  }
}

const updateUser = async (req, res) => {
  try {

    let userId = req.params.userId;

    if (!userId) return res.status(400).send({ status: false, message: "userId is required in path params", });

    if (!isValidObjectId(userId.trim())) return res.status(400).send({ status: false, message: `${userId} is Invalid UserId ` });

    if (userId != req.userId) return res.status(403).send({ status: false, message: "Unauthorized access!" });

    let userData = await userModel.findById(userId)

    if (!userData ) return res.status(404).send({ status: false, message: "No data found." })

    let data = req.body;

    if (!isValidRequestBody(data)) { return res.status(400).send({ status: false, message: 'No User data provided in body for update' }) }

    //validations

    let { fname, lname, email, password, isDeleted } = data

    const filter = { isDeleted: false }

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

      if (await userModel.findOne({ email: email })) { return res.status(400).send({ status: false, message: `User already exist with this ${email}` }) }

      filter.email = email
    }
    if (password) {

      if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password is not in correct format(length should be from 8-15)" })

      //encrypting password
      const saltRounds = 10;
      hash = await bcrypt.hash(password, saltRounds);

      filter.password = hash;
    } if (isDeleted == true || isDeleted == false) {
      filter.isDeleted = isDeleted
    }

    const updateUser = await userModel.findByIdAndUpdate(userId, { $set: filter }, { new: true })

    return res.status(201).send({ status: true, message: 'success', data: updateUser })
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = { signup, getUser, userLogin, deleteUser, deleteUser, updateUser };
