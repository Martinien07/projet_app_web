import { where } from "sequelize";

const User= require("../models/User");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

export const login = async (req,res)=>{
  try {
    const { email,password } = req.body;
    const user= await User.findOne({where:{email}});
    if(!user){
        return  res.statut(404).json({message:'utilisateur non trouvé'})
    }
    const valid=bcrypt.compare(password, user.password)
    if(!valid) return  res.statut(404).json({message:'Mot de passe incorrect'})
    
    const token=jwt.sign(

        {id:user.id,role:user.role },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}

    );


    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }


}