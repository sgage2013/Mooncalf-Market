import { DataTypes, Model, Optional, CreationOptional } from "sequelize";

type OrderItemAttributes = {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
type OrderItemCreationAttributes = Optional<
  OrderItemAttributes,
  "id" | "createdAt" | "updatedAt"
>;
module.exports = (sequelize: any, DataTypes: any) => {
  class OrderItem extends Model<
    OrderItemAttributes,
    OrderItemCreationAttributes
  > {
    declare id: CreationOptional<number>;
    declare orderId: number;
    declare itemId: number;
    declare quantity: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
      OrderItem.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
      OrderItem.belongsTo(models.Item, { foreignKey: "itemId", as: "item" });
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Items",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      timestamps: true,
    }
  );

  return OrderItem;
}