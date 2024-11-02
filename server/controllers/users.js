const { createUserService,logInService } = require("../services/userService")
const {matchedData,validationResult} =require("express-validator")



const createUser=async(req,res,next)=>{
  const credentials = validationResult(req)   
   try {
      if (!credentials.isEmpty()) {
         const err = credentials.array()
         const errMessage =err.map((error)=>error.message)
         errMessage.status = 400
         return next(errMessage)
      }
      const fields = matchedData(req)
      const created = await createUserService(fields)
      if (created) {
        res.status(201).json("User created") 
      }
   } catch (error) {
      const err = new Error(error.message)
      err.status = 500
      err.statusCode = 500
      return next(err)
   }
}

const loginUser=async(req,res,next)=>{
   const credentials = validationResult(req)   
   try {
   if (!credentials.isEmpty()) {
     const err = credentials.array()
      const errMessage =err.map((error)=>error.msg)
      errMessage.status = 400
      return next(errMessage)
   }
   const fields = matchedData(req)
   const {user,token} = await logInService(fields)
    
   if (user) {
      res.status(200).json({...user,token}) 
   }
   
  } catch (error) {
   const err = new Error(error.message)
   err.status = 500
   return next(err)
  }
}
module.exports= {createUser,loginUser}