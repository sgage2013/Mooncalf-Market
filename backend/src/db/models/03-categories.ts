import {DataTypes, Model, Optional, CreationOptional} from 'sequelize';

type SubCategoryAttributes = {
    id: number;
    name: string;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
};
type SubCategoryCreationAttributes = Optional<
    SubCategoryAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;
module.exports = (sequelize: any, DataTypes: any ) => {
    class SubCategory extends Model<
        SubCategoryAttributes,
        SubCategoryCreationAttributes
    > {
        declare id: CreationOptional<number>;
        declare name: string;
        declare categoryId: CreationOptional<number>;
        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;

        static associate(models: any) {
            SubCategory.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'category',
            });
            SubCategory.hasMany(models.Item, {
                foreignKey: 'subCategoryId',
                as: 'items',
            });
        }
    }

    SubCategory.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 50],
                },
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Categories',
                    key: 'id',
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
            modelName: 'SubCategory',
            timestamps: true,
        }
    );

    return SubCategory;
}