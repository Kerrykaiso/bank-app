const {v4: uuidv4}= require("uuid")

module.exports=(sequelize, DataTypes)=>{

    const Beneficiary=sequelize.define("Beneficiary",{
     
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
      accountName:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      accountNumber:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      bankCode:{
        allowNull: false,
        type: DataTypes.STRING
      },
      recepientCode:{
        allowNull: false,
        type: DataTypes.STRING
      }

    
    })
     
   
    return Beneficiary 
   }
   