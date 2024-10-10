const jwt = require("jsonwebtoken")

const userToken =(tokenData)=>{
    return jwt.sign({
        firstname:tokenData.firstname,
        lastname:tokenData.lastname,
        userId:tokenData.id,
        email: tokenData.email,
        role:tokenData.role

    },process.env.ACCESS_TOKEN,{expiresIn:"1d"})
}

module.exports ={userToken}