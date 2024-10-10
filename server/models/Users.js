const {v4: uuidv4} = require("uuid")
const {DataTypes} = require("sequelize")

module.exports=(sequelize)=>{

    const Users=sequelize.define("Users",{
     
      id:{
        type: DataTypes.UUID,
        defaultValue: ()=>uuidv4(),
        primaryKey: true,
        allowNull: false
      },
      
     password:{
       type: DataTypes.STRING,
       allowNull:false
     },
     username:{
       type: DataTypes.STRING,
       allowNull:false
     },
     firstname:{
      type: DataTypes.STRING,
      allowNull:false
     },
     lastname:{
      type: DataTypes.STRING,
      allowNull:false
     },
     email:{
      type: DataTypes.STRING,
      allowNull:false
     },
     role:{
      type: DataTypes.STRING,
      allowNull:false
     },
     isEmailVerified:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
     },
     accountStatus:{
      type: DataTypes.STRING,
      allowNull:false
     }
     
    })
     
   
    return Users 
   }
   