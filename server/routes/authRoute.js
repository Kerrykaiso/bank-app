const { createUser, loginUser} = require("../controllers/users")
const { signUpBody, loginBody } = require("../utils/userValidator")

const router = require("express").Router()

router.post("/createUser",signUpBody, createUser)
router.post("/loginUser",loginBody,loginUser)

module.exports = router
