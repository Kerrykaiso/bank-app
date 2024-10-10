const express = require("express")
const { errorHandler } = require("./utils/errorhandler")
const authRoute= require("./routes/authRoute")
const transactionRoute = require("./routes/transactionRoute")
const accountRoute = require("./routes/accountRoute")
const db=require("./models")

const app = express()
require("dotenv").config()

const  port = process.env.SERVER_PORT



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api",authRoute)
app.use("/api",accountRoute)
app.use("/api",transactionRoute)
app.use(errorHandler)

db.sequelize.sync({alter:true}).then(()=>{
})
app.listen(port,()=>{
console.log(`server running on ${port}`)
})
    