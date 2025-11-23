import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Sale extends Model {}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cliente: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Sale",
    tableName: "sales",
    timestamps: true
  }
);
