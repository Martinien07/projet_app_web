import User from "./User.js";
import Chantier from "./Chantier.js";
import Role from "./Roles.js";
import Assignment from "./Assignment.js";
import Incident from "./Incident.js";

// défifinition des relations plusieurs a plusieurs entre les modeles

// relation pivot entre User et Role via Assignment
// Relation entre User et Chantier via Assignment
User.belongsToMany(Chantier, { through: Assignment, foreignKey: 'userId' });
Chantier.belongsToMany(User, { through: Assignment, foreignKey: 'chantierId' });

// Relation entre Role et User via Assignment
Role.belongsToMany(User, ({through : Assignment, foreignKey: 'roleId'}));
User.belongsToMany(Role, ({through : Assignment, foreignKey: 'userId'}));


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

//relation de assignment vers les autres modeles
Assignment.belongsTo(User, { foreignKey: 'userId' });
Assignment.belongsTo(Chantier, { foreignKey: 'chantierId' });
Assignment.belongsTo(Role, { foreignKey: 'roleId' });

// relation inverse
User.hasMany(Assignment, { foreignKey: 'userId' });
Chantier.hasMany(Assignment, { foreignKey: 'chantierId' });
Role.hasMany(Assignment, { foreignKey: 'roleId' });

export { User, Chantier, Assignment, Incident, Role };

