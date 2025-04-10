 import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

const Cart = sequelize.define('Cart', {

id: {
   type: DataTypes.INTEGER,
    primaryKey:true,
},
name: {
    type:DataTypes.STRING, 
    allowNull:false,
},
email:{
    type:DataTypes.String,
    allownull:false,
    validate:{
        isEmail:true,
    }

}



})

