import bcrypt from "bcrypt";
import database from "../config/connection.js"
import { DataTypes } from "sequelize"  

//Definition du modele User
//Table users

//But : gérer les comptes utilisateurs (maître d’œuvre, sous-traitants, inspecteurs, etc.)

/**id	INTEGER
name	STRING
email	STRING
password	STRING
phone	STRING
status	BOOLEAN
createdAt	DATE
updatedAt	DATE**/

const User=database.define('User',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },          
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,    
    },

    phone:DataTypes.STRING,
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },

    access:{
        type:DataTypes.INTEGER,
        defaultValue:0}  // 0 = user, 1 = admin
    

},


{timestamps:true},
{
    hooks:{

        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        }

    }
}

)    
        
export default User;








