import { DataTypes, Model, Optional, CreationOptional } from 'sequelize';

type CartItemAttributes = {
  id: number;
  cartId: number;
  itemId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
type CartItemCreationAttributes = Optional<
  CartItemAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
module.exports = (sequelize: any, DataTypes: any) => {
  class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> {
    declare id: CreationOptional<number>;
    declare cartId: number;
    declare itemId: number;
    declare quantity: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
      CartItem.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
    }
  }

  CartItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Carts',
          key: 'id',
        },
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id',
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
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'CartItem',
    }
  );

  return CartItem;
}