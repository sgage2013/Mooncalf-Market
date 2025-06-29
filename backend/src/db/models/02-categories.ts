import { DataTypes, Model, Optional, CreationOptional } from "sequelize";

type CategoryAttributes = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
type CategoryCreationAttributes = Optional<
  CategoryAttributes,
  "id" | "createdAt" | "updatedAt"
>;
module.exports = (sequelize: any, DataTypes: any) => {
  class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
      Category.hasMany(models.Item, { foreignKey: "categoryId", as: "items" });
      Category.hasMany(models.SubCategory, {
        foreignKey: "categoryId",
        as: "subcategories",
      });
    }
  }

  Category.init(
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
      modelName: "Category",
      timestamps: true,
    }
  );

  return Category;
};
