const { initiatePaystackDeposit,verifyPaystackDeposit, internalTransfer, externalTransfer } = require("../controllers/transaction")
const { customerAuth } = require("../middlewares/verifyToken")

const router = require("express").Router()

router.post("/initiateDeposit",customerAuth, initiatePaystackDeposit)
router.post("/verifyDeposit",verifyPaystackDeposit)
router.post("/internalTransfer",internalTransfer)
router.post("/externalTransfer",externalTransfer)
module.exports =router