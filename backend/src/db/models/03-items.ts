import { DataTypes, Model, Optional, CreationOptional } from "sequelize";

type ItemAttributes = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  subCategoryId: number;
  listId: number;
  createdAt: Date;
  updatedAt: Date;
};
type ItemCreationAttributes = Optional<
  ItemAttributes,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "listId"
  | "categoryId"
  | "subCategoryId"
>;
module.exports = (sequelize: any, DataTypes: any) => {
  class Item extends Model<ItemAttributes, ItemCreationAttributes> {
    declare id: CreationOptional<number>;
    declare listId: number;
    declare name: string;
    declare description: string;
    declare price: number;
    declare imageUrl: string;
    declare categoryId: number;
    declare subCategoryId: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
      Item.belongsTo(models.List, { foreignKey: "listId", as: "list" });
      Item.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Item.belongsTo(models.SubCategory, {
        foreignKey: "subCategoryId",
        as: "subCategory",
      });
      Item.hasMany(models.Review, { foreignKey: "itemId", as: "reviews" });
    }
  }

  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Lists",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 250],
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SubCategories",
          key: "id",
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
      modelName: "Item",
      timestamps: true,
    }
  );

  return Item;
};
