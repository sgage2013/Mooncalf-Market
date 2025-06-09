import {DataTypes, Model, Optional, CreationOptional} from 'sequelize';

type OrderAttributes = {
    id: number;
    userId: number;
    orderNumber: number;
    orderTotal: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};
type OrderCreationAttributes = Optional<
    OrderAttributes,
    "id" | "createdAt" | "updatedAt"
>;
module.exports = (sequelize: any, DataTypes: any) => {
    class Order extends Model<OrderAttributes, OrderCreationAttributes> {
        declare id: CreationOptional<number>;
        declare userId: number;
        declare orderNumber: number;
        declare orderTotal: number;
        declare status: string;
        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;

        static associate(models: any) {
            Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" });
        }
    }

    Order.init(
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
                    model: "Users",
                    key: "id",
                },
            },
            orderNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            orderTotal: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["pending","processing", "confirmed", "shipped", "out for delivery", "delivered", "cancelled"]],
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
            modelName: "Order",
            timestamps: true,
        }
    );

    return Order;
}