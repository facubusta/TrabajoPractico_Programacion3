import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Product = sequelize.define("Product", {
  name:      { type: DataTypes.STRING,  allowNull: false },
  price:     { type: DataTypes.FLOAT,   allowNull: false },
  imagePath: { type: DataTypes.STRING },
  type:      { type: DataTypes.ENUM("A","B"), allowNull: false },
  active:    { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: "products",
});
