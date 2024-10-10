const {v4: uuidv4}= require("uuid")

module.exports=(sequelize, DataTypes)=>{

    const Transactions=sequelize.define("Transactions",{
     
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
      accountId:{
        type:DataTypes.STRING,
        allowNull:false
      },
      amount:{
        type: DataTypes.DECIMAL(30,2),
        defaultValue: 0.0,
        allowNull:false

      },
      type:{
       type:DataTypes.STRING,
       allowNull:false
      },
      status:{
        type:DataTypes.STRING,
        allowNull:false
      },
      reference:{
        type:DataTypes.STRING,
        allowNull:false
      },
      receiver:{
        type:DataTypes.STRING,
       allowNull:true
      },
      gateway:{
        type: DataTypes.STRING,
        allowNull: false
      }
      
    
    })
     
   
    return Transactions 
   }
   