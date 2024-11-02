const { 
     initiatePaystackDeposit,
     verifyPaystackDeposit,
     internalTransfer,
     externalTransfer, 
     getTransactionsByAccounts,
     getTransactionsByAccountsId} = require("../controllers/transaction")
     const {paystackWebhook}= require("../services/webhook")
const { customerAuth } = require("../middlewares/verifyToken")

const router = require("express").Router()

router.post("/initiateDeposit",customerAuth, initiatePaystackDeposit)
router.post("/verifyDeposit",verifyPaystackDeposit)
router.post("/internalTransfer",internalTransfer)
router.post("/externalTransfer",externalTransfer)
router.get("/:accountId",getTransactionsByAccounts)
router.get("/:transactionId",getTransactionsByAccountsId)
router.post("/paystack-webhook",paystackWebhook)
module.exports =router