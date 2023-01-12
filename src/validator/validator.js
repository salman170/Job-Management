const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId.isValid
// ------------- validation of data  -------------
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};


// ------------- validation of user name -------------

const isValidName = function (value) {
    if (typeof value == "string") {
        if (value.trim() !== "") {
            let regex = /^([a-zA-Z ]){2,30}$/
            return regex.test(value.trim())
        } else return false
    } else return false
}



// ------------- validation of email -------------

const isValidEmail = function (value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        let firstLetter = /^(?=.*[A-Za-z])/
        let isValid = /^[a-zA-Z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/;
        if (firstLetter.test(value.trim()[0]) && isValid.test(value.trim())) { return true }
        else { return false }
    }
}

// ------------- validation of password -------------

const isValidPassword = function (value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        let isValid = /^(?!.* )(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*()+=]).{8,15}$/
        return isValid.test(value.trim());
    }
}
const isValidCompany = function (value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        let isValid = /^[A-Z]([a-zA-Z0-9]|[- @\.#&!])*$/
        return isValid.test(value.trim());
    }
}


const alphaNumericValid = (value) => {
    let alphaRegex = /^[a-zA-Z0-9-_,. ]+$/;
    if (alphaRegex.test(value)) return true; // /^[- a-zA-Z'\.,][^/]{1,150}/ allows every things
}

const isValidObjectId = (value) =>{
    if(!ObjectId(value)) return false
    else return true
}

    module.exports = { isValidRequestBody, isValidName, isValidEmail, isValidPassword, isValidCompany, alphaNumericValid, isValidObjectId }