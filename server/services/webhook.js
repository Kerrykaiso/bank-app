const crypto = require("crypto")
const db = require("../models/index")
const { createTransactionService, changeBalance } = require("./transactionService")

const paystackWebhook=async(req,res,next)=>{
     
    const secretKey = process.env.PAYSTACK_KEY
    const hash = crypto.createHmac("sha512",secretKey).update(JSON.stringify(req.body)).digest("hex")
    if (hash===req.headers["x-paystack-signature"]) {
        const data = req.body
       
        if (data.event==="charge.success") {
          const{amount,reference}=data
          const {accountId,type,status,gateway,receiver,userId} = data.metadata
          
          const newTransaction={
            userId,
            accountId,
            amount,
            type,
            status,
            reference, 
            receiver,
            gateway
          }
      try {
          //create transaction
          await createTransactionService(newTransaction)
          await changeBalance(accountId,amount)
          return res.status(200).end()
        } catch (error) {
          console.log(error.message)
          return res.status(200).end()
        }
     }
     if (data.event==="transfer.success") {
      const{amount,reference}=data
      const {accountId,type,status,gateway,receiver,userId} = data.metadata
      
      const newTransaction={
        userId,
        accountId,
        amount,
        type,
        status,
        reference, 
        receiver,
        gateway
      }
      try {
        await createTransactionService(newTransaction)
        await changeBalance(accountId,-amount)
        return res.status(200).end()
      } catch (error) {
        console.log(error.message)
        return res.status(200).end()
      }
     }
    } else{
        return null
    }


 
}
module.exports={paystackWebhook}