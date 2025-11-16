import bcrypt from "bcrypt";
import database from "../config/connection.js";
import { DataTypes } from "sequelize";

// Définition du modèle User
const User = database.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  access: {
    type: DataTypes.INTEGER,
    defaultValue: 0  // 0 = user, 1 = admin
  }
}, {
  timestamps: true,

  //  Les hooks doivent être à l'intérieur du même objet d’options
  hooks: {
    //  Hachage automatique avant création
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },

    //  Hachage avant mise à jour si le mot de passe change
    beforeUpdate: async (user) => {
      if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

export default User;
