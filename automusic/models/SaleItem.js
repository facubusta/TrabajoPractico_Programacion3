import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { Sale } from "./Sale.js";
import { Product } from "./Product.js";

export class SaleItem extends Model {}

SaleItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sale,
        key: "id"
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id"
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "SaleItem",
    tableName: "sale_items",
    timestamps: true
  }
);

// Asociaciones
Sale.hasMany(SaleItem, { foreignKey: "saleId", as: "items" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });

Product.hasMany(SaleItem, { foreignKey: "productId" });
SaleItem.belongsTo(Product, { foreignKey: "productId" });
