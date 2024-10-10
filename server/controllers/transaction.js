const {
  generatePaystackUrlService,
  createTransactionService,
   verifyPaystackDepositService,
    deposit,
    transferAccounts,
    changeBalance,
    searchBeneficiary,
    findAccountbyId,
    createPaystackRecipient,
    createBeneficiary,
    externalTransferService} = require("../services/transactionService")
const { transactionType,transactionStatus, gateway } = require("../utils/constants")
const { generatePaystackRefrence } = require("../utils/generate,js")

const initiatePaystackDeposit=async(req,res,next)=>{
  const email = req.user.email
  const amount = req.body.amount
  const {userId} = req.user
  const accountId = req.body.accountId
  const type = transactionType.DEPOSIT
try {
  const paystackInfo = await generatePaystackUrlService(email,amount)

  const newTransaction={
    userId,
    accountId,
    amount,
    type,
    status: transactionStatus.IN_PROGRESS,
    reference:paystackInfo.reference, 
    receiver: null,
    gateway: gateway.PAYSTACK
  }

  const transaction = await createTransactionService(newTransaction)
  if (!transaction) {
    const err = new Error("something went wrong")
    err.status = 400
    return next(err)
  }
   res.status(201).json({transaction,url:transaction.authorization_url})

} catch (error) {
  const err = new Error(error.message)
  err.status = 400
  return next(err)
}}


const verifyPaystackDeposit = async(req,res,next)=>{
//refactor to use webhook in a later version 
//make the deposit function the webhook api
const reference = req.body.reference
try {
  const verifiedTransaction = await verifyPaystackDepositService(reference)
  if (!verifiedTransaction) {
      const err = new Error("Payment not found")
      err.status = 400
      return next(err)
  }

  const {amount,accountId,transactionId} = verifiedTransaction
  const confirmDeposit = await deposit(accountId,amount,transactionId,transactionStatus.COMPLETED)

  if (!confirmDeposit) {
    const err = new Error("Payment not deposited or confirmed")
    err.status = 400
    return next(err)
  }  
  res.status(200).json("Deposit confirmed")

} catch (error) {
  const err = new Error(error.message)
  err.status = 400
  return next(err)
}

}


const internalTransfer=async(req,res,next)=>{
  const {reciverAccountNumber,senderAccountId,amount} = req.body
  try {
    const {receiver,senderAccount} = await transferAccounts(reciverAccountNumber,senderAccountId)
    if (!senderAccount) {
      const err = new Error("account not found")
      err.status = 400
      return next(err)
    }
    if (senderAccount.balance < amount) {
      const err = new Error("insufficient funds")
      err.status = 400
      return next(err)
    }

    //make sure sender is not sending to himself
    if (receiver.userId===senderAccount.userId) {
      const err = new Error("cannot send to account initiating transaction")
      err.status = 400
      return next(err)
    }
   const receiverTopUp = await changeBalance(receiver.id,amount)
    const senderDeduct = await changeBalance(senderAccount.id,-amount)

    if (!receiverTopUp || !senderDeduct ) {
      const err = new Error("failed to change balance")
      err.status = 400
      return next(err)
    }
    //create transaction

    const newTransaction={
      userId: senderAccount.userId,
      accountId: senderAccount.id,
      amount,
      type: transactionType.TRANSFER,
      status: transactionStatus.COMPLETED,
      reference: generatePaystackRefrence(),
      receiver:reciverAccountNumber,
      gateway: gateway.NONE
    }

    const transaction = await createTransactionService(newTransaction)
    if (!transaction) {
      const err = new Error("Something went wrong")
      err.status = 400
      return next(err)
    }
     res.status(200).json("Transfer successful")

  } catch (error) {
    const err = new Error(error.message)
    err.status = 400
    return next(err)
  }
}


const externalTransfer = async(req,res,next)=>{
  const {reciverAccountNumber,receiverAccountName,bankCode,amount,message,senderAccountId}= req.body
   try {

    const findAccount = await findAccountbyId(senderAccountId)
    if (!findAccount) {
      const err = new Error("Account not found")
      err.status = 400
      return next(err)
    }
   if (amount <= 0) {
    const err = new Error("Transfer amount must be greater than 0")
    err.status = 400
    return next(err)
   }
    if (findAccount.balance < amount) {
      const err = new Error("Insufficient balance")
      err.status = 400
      return next(err)
    }
     let code
      const  beneficiaryCode = await searchBeneficiary(receiverAccountName,bankCode)
    if (!beneficiaryCode) {
          //create paystack recepient
          const codeData={
            type: "nuban",
            name:receiverAccountName,
            account_number:reciverAccountNumber,
            bank_code: bankCode,
            currency: "NGN"
          }
          const newCode = await createPaystackRecipient(codeData)
          if (!newCode) {
            const err = new Error("could not create paystack receipient")
            err.status = 400
            return next(err)
          }
          code = newCode

       const beneficiaryDetails={
          userId: findAccount.id,
          accountName:receiverAccountName,
          accountNumber: reciverAccountNumber,
          bankCode,
          receipentCode: code
       }   
      const beneficiaryCreated = await createBeneficiary(beneficiaryDetails)
      if (!beneficiaryCreated) {
        const err = new Error("could not save beneficiary")
        err.status = 400
        return next(err)
      }
    } else {
      code = beneficiaryCode.receipentCode
    }
    //initiate transfer
    const transfer = await externalTransferService(message,amount,code)
    if (!transfer) {
      const err = new Error("could not transfer with paystack")
      err.status = 400
      return next(err)
    }
    const newTransaction={
      userId: findAccount.userId,
      accountId: findAccount.id,
      amount,
      type: transactionType.TRANSFER,
      status: transactionStatus.IN_PROGRESS,
      reference: transfer.reference,
      receiver:reciverAccountNumber,
      gateway: gateway.PAYSTACK
    }

    const transaction = await createTransactionService(newTransaction)
    if (!transaction) {
      const err = new Error("could not create transaction")
      err.status = 400
      return next(err)
    }
    res.status(201).status("Transfer successful")
   } catch (error) {
    const err = new Error(error.message)
    err.status = 500
    return next(err)
   }
}

module.exports ={
  initiatePaystackDeposit,
  verifyPaystackDeposit,
  internalTransfer,
  externalTransfer
}