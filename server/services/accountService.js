const {Accounts} = require("../models")
const { accountStatus } = require("../utils/constants")
const { generateAccountNumber } = require("../utils/generate,js")

const createAccountService = async(data)=>{
 try {
    
  const createAccountNumber = generateAccountNumber()
  const checkAccountNumber = await Accounts.findOne({where:{accountNumber:createAccountNumber}})

  if (checkAccountNumber) {
    throw new Error("Account number already in use")
  }
  const accountData = {
    ...data,
    balance: 0.00,
    accountNumber:createAccountNumber,
    status: accountStatus.ACTIVE
  }
  const createdAccount = await Accounts.create(accountData)

  return createdAccount

 } catch (error) {
    throw new Error(error.message)
 }
}

const fetchAccountService=async(userId)=>{

try {
  const allAccounts = await Accounts.findAll({where:{userId}})
  return allAccounts.dataValues
} catch (error) {
  throw new Error(error.message)
}
}

const fetchAccountByIdService=async(id)=>{

  try {
    const accountInfo = await Accounts.findOne({where:{id}})
    const account = accountInfo.dataValues
    return account
  } catch (error) {
    throw new Error(error.message)
  }
  }
module.exports={createAccountService,fetchAccountService,fetchAccountByIdService}