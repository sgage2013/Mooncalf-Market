import {DataTypes, Model, Optional, CreationOptional} from 'sequelize';

type OrderAttributes = {
    id: number;
    userId: number;
    orderNumber: string;
    subTotal: number;
    tax: number;
    shipping: number;
    orderTotal: number;
    stripePaymentIntentId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
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
        declare orderNumber: string;
        declare subTotal: number;
        declare tax: number;
        declare shipping: number;
        declare orderTotal: number;
        declare stripePaymentIntentId: string;
        declare address: string;
        declare city: string;
        declare state: string;
        declare zip: string;
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
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            subTotal: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            tax: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            shipping: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            orderTotal: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            stripePaymentIntentId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            zip: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["Pending","Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"]],
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