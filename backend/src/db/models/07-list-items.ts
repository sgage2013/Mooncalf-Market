import {DataTypes, Model, Optional, CreationOptional} from 'sequelize';

type ListItemAttributes = {
    id: number;
    listId: number;
    itemId: number;
    createdAt: Date;
    updatedAt: Date;
};
type ListItemCreationAttributes = Optional<
    ListItemAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;
module.exports = (sequelize: any, DataTypes: any) => {
    class ListItem extends Model<
        ListItemAttributes,
        ListItemCreationAttributes
    > {
        declare id: CreationOptional<number>;
        declare listId: number;
        declare itemId: number;
        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;

        static associate(models: any) {
            ListItem.belongsTo(models.List, {foreignKey: 'listId', as: 'list'});
            ListItem.belongsTo(models.Item, {foreignKey: 'itemId', as: 'item'});
        }
    }

    ListItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            listId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Lists',
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
            modelName: 'ListItem',
            timestamps: true,
        }
    );

    return ListItem;
}