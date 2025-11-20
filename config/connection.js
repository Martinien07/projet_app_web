//Importer le module qui permet de lire les variables d'environnement
import dotenv from 'dotenv'

//Importer l'ORM Sequelize
import { Sequelize } from 'sequelize';

//Lecture des variables d'environnement
const ENV=dotenv.config().parsed; 

//Definir la connexion a la base de donnees

const connection=new Sequelize(
    ENV.DB_NAME,
    ENV.DB_USER,  
    ENV.DB_PASSWORD,
    {
        host:ENV.DB_HOST,   
        dialect:ENV.DB_DIALECT,
        // port:ENV.DB_PORT,
    }
);  

export default connection;
