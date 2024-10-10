const { generatePaystackRefrence } = require("../utils/generate,js")
const {Transactions} = require("../models")
const {Accounts} = require("../models")
const {Benficiary} = require("../models")
const db = require("../models/index")
const axios = require("axios")

const generatePaystackUrlService=async(email,amount)=>{
  
    const paystackParams={
        email,
        amount: amount * 100,
        channels:["card"],
        reference: generatePaystackRefrence()
    }
   
    const config={
        headers:{
            authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
            "Content-type": "application/json"
        }
    }
   try {
    const {data} = await axios.post("https://api.paystack.co/transaction/initialize", paystackParams,config)
    if (data && data.status) {
        return data.data
    }
   } catch (error) {
    throw new Error(error.message)
   }
}

const createTransactionService=async(transactionDetail)=>{
try {
    const transact = await db.sequelize.transaction() 
    const createTransaction = await Transactions.create(transactionDetail,{transact})
    await transact.commit()
    return createTransaction
} catch (error) {
    await transact.rollback()
    throw new Error(error.message)
}}


const verifyPaystackDepositService= async(ref)=>{
    try {
        const findTransaction= await Transactions.findOne({where:{reference:ref}})
     if (!findTransaction) {
        throw new Error("Transaction not found")
     }
     const transactionRef = findTransaction.reference
     const transactionAmount = findTransaction.amount*100
     const accountId = findTransaction.accountId
     const transactionId = findTransaction.id
      const config={
        headers:{
            authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
            "Content-type": "application/json"
        }
     }
     const {data} = await axios.get(`https://api.paystack.co/transaction/verify/${transactionRef}`,config)
     if (data && data.status) {
        const {amount} = data.data 
        if (amount !== transactionAmount) {
            throw new Error("transaction amount does not match")  
        }
      return {amount,accountId,transactionId}
     }
     return false
   
    } catch (error) {
        throw new Error(error.message)
    }
}


const deposit = async(accountId,amount,transactionId,status)=>{
    try {
        const transact = await db.sequelize.transaction()

        const depositAmount = parseInt(amount)
        const account = await Accounts.findOne({where:{id:accountId}},{transact})
        if (account.status !=="ACTIVE") {
            throw new Error("Account is not active")
        }
      await account.increment("balance", {by:depositAmount},{transact})
      await Transactions.update({status},{where:{id:transactionId}},{transact})
      await transact.commit()
      return true
    } catch (error) {
        await transact.rollback()
        throw new Error(error.message)
    }
}


const changeBalance=async(accountId,amount)=>{
 try {
   // const depositAmount = parseInt(amount)
   const transact = await db.sequelize.transaction()

     const update ={
        balance: db.sequelize.literal(`balance+${amount}`)
     }
      await Accounts.update(update,{where:{id:accountId}},{transact})
      await transact.commit()
      return true
 }  catch (error) {
     await transact.rollback()
    throw new Error(error.message)
 }
}

const changeStatus = async(transactionId,status)=>{
  try {
    const transact = await db.sequelize.transaction()

    const update={
        status
    }
    await Accounts.update(update,{where:{id:transactionId}},{transact})
    await transact.commit()
    return true
  } catch (error) {
    await transact.rollback()
    throw new Error(error.message)
  }
}

const findAccountbyId=async(id)=>{
try {
  const accountFound = await Accounts.findOne({where:{id}})
  if (accountFound) {
    return accountFound
  }
  return null
} catch (error) {
  throw new Error(error.message)
}

}



const transferAccounts=async(reciverAccountNumber,senderAccountId)=>{
  try {
    const senderAccount = await Accounts.findOne({where:{id:senderAccountId}})
    const receiver = await Accounts.findOne({where:{accountNumber:reciverAccountNumber}})
    if (!receiver) {
      throw new Error("Cannot find receiver account")
    }
    return {senderAccount,receiver}
  } catch (error) {
    throw new Error(error.message)
  }
}

const searchBeneficiary=async(accountNumber, bankCode)=>{
try {
  const findBeneficiary = await Benficiary.findOne({where:{accountNumber,bankCode}})
   if (!findBeneficiary) {
     throw new Error("beneficiary not found")
   }
  return findBeneficiary.recepientCode

} catch (error) {
  throw new Error(error.message)
}
}



const createPaystackRecipient=async(details)=>{
 try {
  const params={
    ...details
  }
  const config={
    headers:{
      authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
      "Content-type": "application/json"
  }
  }
  const {data} = await axios.post("https://api.paystack.co/transferrecipient",params,config)
  if (data && data.status) {
     return data.data.recipient_code
  }
  return null
 } catch (error) {
   return null
 }
}

const createBeneficiary=async(data)=>{
  try {
    const beneficiary = await Benficiary.create(data)
    if (!beneficiary) {
      return null
    }
    return true
  } catch (error) {
    throw new Error(error.message)
  }
}

const externalTransferService=async(message,amount,code)=>{
  const params={
    source: "balance",
    amount: amount*100,
    reason: message,
    recipient:code,
    currency: "NGN",
    reference:generatePaystackRefrence()
  }
  const config={
    headers:{
        authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
        "Content-type": "application/json"
    }
  } 
 try {
    const {data} = await axios.post("https://api.paystack.co/transfer",params,config)
    if (data && data.status) {
      return{
        reference: params.reference,
        transferCode:data.data.transfer_code
      }
    }
   return null
 } catch (error) {
  throw new Error(error.message)
 }
}
module.exports={
    generatePaystackUrlService,
    createTransactionService,
    verifyPaystackDepositService,
    deposit,
    changeBalance,
    changeStatus,
    transferAccounts,
    searchBeneficiary,
    findAccountbyId,
    createPaystackRecipient,
    createBeneficiary,
    externalTransferService
}