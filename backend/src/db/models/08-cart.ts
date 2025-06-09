import {DataTypes, Model, Optional, CreationOptional} from 'sequelize';

type CartAttributes = {
    id: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
};
type CartCreationAttributes = Optional<
    CartAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;
module.exports = (sequelize: any, DataTypes: any) => {
    class Cart extends Model<CartAttributes, CartCreationAttributes> {
        declare id: CreationOptional<number>;
        declare userId: number;
        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;

        static associate(models: any) {
            Cart.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
            Cart.hasMany(models.CartItem, {foreignKey: 'cartId', as: 'cartItem'});
        }
    }

    Cart.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
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
            modelName: 'Cart',
        }
    );

    return Cart;
}