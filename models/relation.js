import User from "./User.js";
import Chantier from "./Chantier.js";


//Definition des relations plusieurs a plusieurs entre les modeles
//DUser.belongsToMany(Role, { through: "UserRoles" }) //Un user a un role

//DRole.belongsToMany(User, { through: "UserRoles" }); //Un role appartient a un user

// Users <=> Chantiers (Many-to-Many via UserChantiers)
  User.belongsToMany(Chantier, { through: 'UserChantiers', as: 'Chantiers', foreignKey: 'userId' });
  Chantier.belongsToMany(User, { through: 'UserChantiers', as: 'Users', foreignKey: 'chantierId' });

export { User, Chantier };