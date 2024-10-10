const {createAccountService,fetchAccountService,fetchAccountByIdService}= require("../services/accountService")
const { escapeHtml } = require("../utils/errorhandler")

const createAccount = async(req,res,next)=>{
  const details = req.body
  const {userId} = req.user

  const accountDetails={
    ...details,
       userId
  }

  try {

    const createdAccount = await createAccountService(accountDetails)
    if (createdAccount) {
        res.status(201).json(createdAccount)
    }
  } catch (error) {
    const err = new Error(error.message)
    err.status = 400
    return next(err)
  }
}


const getUserAccounts=async(req,res,next)=>{
  const {userId} = req.user

try {
   const allAccounts = await fetchAccountService(userId)
   res.status(200).json(allAccounts)
} catch (error) {
  const err = new Error(error.message)
  err.status = 400
  return next(err)
}
}

const getUserAccountsById=async(req,res,next)=>{
  const {id} = req.params
 
try {
   const account = await fetchAccountByIdService(escapeHtml(id))
   res.status(200).json(account)
} catch (error) {
  const err = new Error(error.message)
  err.status = 400
  return next(err)
}
}

module.exports= {createAccount,getUserAccounts,getUserAccountsById}