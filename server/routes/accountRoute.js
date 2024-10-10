const router = require("express").Router()
const {createAccount,getUserAccounts,getUserAccountsById} = require("../controllers/account")
const {customerAuth} = require("../middlewares/verifyToken")

router.post("/create-account",customerAuth,createAccount)
router.get("/getUserAccounts",getUserAccounts )
router.get("/getUserAccounts/:id",getUserAccountsById )
module.exports= router