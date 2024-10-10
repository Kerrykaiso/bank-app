const {v4: uuidv4}= require("uuid")

module.exports=(sequelize, DataTypes)=>{

    const Accounts=sequelize.define("Accounts",{
     
      id:{
        type: DataTypes.UUID,
         defaultValue: ()=>uuidv4(),
         primaryKey: true,
         allowNull: false
      },
      userId:{
        allowNull: false,
        type: DataTypes.STRING
      },
      accountNumber:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      balance:{
        type: DataTypes.DECIMAL(30,2),
        defaultValue: 0.00,
        allowNull:false

      },
      type:{
       type:DataTypes.STRING,
       allowNull:false
      },
      status:{
        type:DataTypes.STRING,
        allowNull:false
      }

    
    })
     
   
    return Accounts 
   }
   