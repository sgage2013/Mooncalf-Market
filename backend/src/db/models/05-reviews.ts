import {DataTypes, Model, Optional, CreationOptional} from 'sequelize';

type ReviewAttributes = {
    id: number;
    itemId: number;
    userId: number;
    stars: number;
    reviewBody: string;
    createdAt: Date;
    updatedAt: Date;
};
type ReviewCreationAttributes = Optional<
    ReviewAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;
module.exports = (sequelize: any, DataTypes: any) => {
    class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
        declare id: CreationOptional<number>;
        declare itemId: number;
        declare userId: number;
        declare stars: number;
        declare reviewBody: string;
        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;

        static associate(models: any) {
            Review.belongsTo(models.Item, {foreignKey: 'itemId', as: 'item'});
            Review.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
        }
    }

    Review.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            itemId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Items',
                    key: 'id',
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            stars: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            reviewBody: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [25, 250], 
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
            modelName: 'Review',
            timestamps: true,
        }
    );

    return Review;
}