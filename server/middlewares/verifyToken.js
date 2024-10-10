const jwt = require("jsonwebtoken")

const checkToken=(req,res,next)=>{
    const authHeader = req.headers.authorization
    const startWithBearer = authHeader.startsWith("Bearer")

    if (authHeader && startWithBearer) {
        const token=authHeader.split(" ")[1]

        jwt.verify(token, process.env.ACCESS_TOKEN, (err,user)=>{
            if(err){
               return  res.status(400).json("invalid token")
            }
            req.user=user
          next()

        })
    }else if (req.Authenticated) {
        next()
    }else {
        res.status(400).json("invalid or missing token")
    }
}   

const adminAuth=(req, res, next)=>{
    checkToken(req, res,()=>{
      if (req.user.role==="ADMIN") {
          next()
      }
      else{
          res.status(403).json("you are not authorized for this")
      }
    })
  }

  const editorAuth=(req, res, next)=>{
    checkToken(req, res,()=>{
      if (req.user.role==='EDITOR') {
          next()
      }
      else{
          res.status(403).json("you are not authorized for this")
      }
    })
  }

  const customerAuth=(req, res, next)=>{
    checkToken(req, res,()=>{
      if (req.user.role==='CUSTOMER') {
          next()
      }
      else{
          res.status(403).json("you are not authorized for this")
      }
    })
  }


  module.exports = {editorAuth,adminAuth,customerAuth}