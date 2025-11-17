// models/Assignment.js
import database from "../config/connection.js"
import { DataTypes } from "sequelize"

const Assignment = database.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  chantierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Chantiers',
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id'
    }
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'assignments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'chantierId']
    }
  ]
});

export default Assignment;