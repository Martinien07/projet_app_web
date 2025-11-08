// This is the Assignment model

import database from "../config/connection.js"
import { DataTypes } from "sequelize"

/*
id INTEGER

userId INTEGER

chantierId INTEGER

roleId INTEGER

assignedAt DATE

isActive BOOLEAN

createdAt DATE

updatedAt DATE
*/

const Assignment=database.define('Assignment',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    chantierId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    roleId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    assignedAt:{
        type:DataTypes.DATE,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    createdAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    },
    updatedAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
});

export default Assignment;
