const { body}=require("express-validator")


const signUpBody = [
    body("firstname").isString().notEmpty().withMessage("please provide your firstname"),
    body("email").isString().notEmpty().withMessage("please provide your email"),
    body("lastname").isString().notEmpty().withMessage("please provide your lastname"),
    body("password").isString().notEmpty().withMessage("please provide a password")

]

const loginBody = [
    body("email").isString().notEmpty().withMessage("please provide your email"),
    body("password").isString().notEmpty().withMessage("please provide a password")

]

module.exports ={signUpBody,loginBody}