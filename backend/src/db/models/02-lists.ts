import { DataTypes, Model, Optional, CreationOptional } from "sequelize";

type ListAttributes = {
  id: number;
  userId: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
type ListCreationAttributes = Optional<
  ListAttributes,
  "id" | "createdAt" | "updatedAt" | "userId"
>;

module.exports = (sequelize: any, DataTypes: any) => {
  class List extends Model<ListAttributes, ListCreationAttributes> {
    declare id: CreationOptional<number>;
    declare userId: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
      List.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      List.hasMany(models.Item, { foreignKey: "listId", as: "items" });
    }
  }

  List.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 250],
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
      modelName: "List",
      timestamps: true,
    }
  );
  return List;
};
