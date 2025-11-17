import User from "./User.js";
import Chantier from "./Chantier.js";
// import Role from "./Role.js";
import Assignment from "./Assignment.js";
import Incident from "./Incident.js";

//Definition des relations plusieurs a plusieurs entre les modeles
//DUser.belongsToMany(Role, { through: "UserRoles" }) //Un user a un role

//DRole.belongsToMany(User, { through: "UserRoles" }); //Un role appartient a un user


  // Dans votre fichier relation.js
Assignment.belongsTo(User, { foreignKey: 'userId' });
Assignment.belongsTo(Chantier, { foreignKey: 'chantierId' });
// Assignment.belongsTo(Role, { foreignKey: 'roleId' });

User.hasMany(Assignment, { foreignKey: 'userId' });
Chantier.hasMany(Assignment, { foreignKey: 'chantierId' });
// Role.hasMany(Assignment, { foreignKey: 'roleId' });

Incident.belongsTo(Chantier, { foreignKey: 'chantierId' });
Incident.belongsTo(User, { foreignKey: 'reportedBy', as: 'Reporter' });

Chantier.hasMany(Incident, { foreignKey: 'chantierId' });
User.hasMany(Incident, { foreignKey: 'reportedBy', as: 'ReportedIncidents' });

export { User, Chantier, Assignment, Incident };
