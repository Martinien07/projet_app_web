import database from "../config/connection.js"
import { DataTypes } from "sequelize"  

//Definition du modele User
//Table users

//But : gérer les comptes utilisateurs (maître d’œuvre, sous-traitants, inspecteurs, etc.)

//Champ	Type	Description
//id	SERIAL (PK)	Identifiant unique
//nom	VARCHAR(100)	Nom complet
//email	VARCHAR(100)	Email unique
//mot_de_passe	VARCHAR(255)	Hash bcrypt
//role	ENUM('admin', 'maitre_oeuvre', 'sous_traitant', 'inspecteur')	Rôle utilisateur
//telephone	VARCHAR(20)	Téléphone
//entreprise	VARCHAR(100)	Nom de l’entreprise (facultatif)
//date_creation	TIMESTAMP	Date d’inscription
const User=database.define('User',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },          
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,    
    },
    role:{
        type:DataTypes.ENUM('admin', 'maitre_oeuvre', 'sous_traitant', 'inspecteur'),
        allowNull:false,
    },

    telephone:DataTypes.STRING,
    entreprise:DataTypes.STRING,
},{timestamps:true})    
        
export default User;







