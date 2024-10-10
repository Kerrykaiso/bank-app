const {Users} = require("../models")
const bcrypt = require("bcryptjs")
const { roles, accountStatus } = require("../utils/constants")
const { userToken } = require("../utils/jwt")

const createUserService=async(data)=>{
  const findExisitingUser = await Users.findOne({where:{email:data.email}})

  if (findExisitingUser) {
    throw new Error(" This email is already in use")
  } 


  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(data.password, salt)
  
  const newUser={
    ...data,
    role:roles.CUSTOMER,
    accountStatus:accountStatus.ACTIVE,
    username: data.email.split("@")[0],
    password:hashPassword
  }

  const createdUser = await Users.create(newUser)

  return createdUser

  
}

const logInService = async(data)=>{
  const findExisitingUser = await Users.findOne({where:{email:data.email}})

  if (!findExisitingUser) {
    throw new Error("Incorrect email or password")
  }
  const comparePassword = await bcrypt.compare(data.password,findExisitingUser.password)

  if (!comparePassword) {
    throw new Error("Incorrect email or password")
  }
  
  const signToken={
    id:findExisitingUser.id,
    email: findExisitingUser.email,
    role: findExisitingUser.role,
    firstname:findExisitingUser.firstname,
    lastname:findExisitingUser.lastname
  }
  const token = userToken(signToken)

  const {password,...user} = findExisitingUser.dataValues

  return{
    user,
    token
  }
}
module.exports= {createUserService,logInService}