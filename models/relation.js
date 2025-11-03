import User from "./User.js";


//Definition des relations plusieurs a plusieurs entre les modeles
//DUser.belongsToMany(Role, { through: "UserRoles" }) //Un user a un role

//DRole.belongsToMany(User, { through: "UserRoles" }); //Un role appartient a un user

// Relations un vers plusieurs entre Department et User

//DDepartment.hasMany(User)
//DUser.belongsTo(Department)

//Dexport { User, Role, Department };
