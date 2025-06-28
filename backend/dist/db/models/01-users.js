"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const { Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends sequelize_1.Model {
        getSafeUser() {
            return __awaiter(this, void 0, void 0, function* () {
                const safeUser = {
                    id: this.id,
                    email: this.email,
                    username: this.username,
                    firstName: this.firstName,
                    lastName: this.lastName,
                };
                return safeUser;
            });
        }
        static associate(models) {
            User.hasMany(models.Cart, {
                foreignKey: 'userId',
                as: 'carts'
            });
            User.hasMany(models.Order, {
                foreignKey: 'userId',
                as: 'orders'
            });
            User.hasMany(models.Review, {
                foreignKey: 'userId',
                as: 'reviews'
            });
            User.hasOne(models.Cart, {
                foreignKey: 'userId',
                as: 'cart'
            });
        }
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isGoodLength(value) {
                    if (value.length < 1 || value.length > 30) {
                        throw new Error('First name must be between 1 - 30 characters');
                    }
                },
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isGoodLength(value) {
                    if (value.length < 1 || value.length > 30) {
                        throw new Error('Last name must be between 1 - 30 characters');
                    }
                },
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isGoodLength(value) {
                    if (value.length < 6 || value.length > 12) {
                        throw new Error('Username must be between 6 - 12 characters');
                    }
                },
                isNotEmail(value) {
                    if (Validator.isEmail(value)) {
                        throw new Error("Cannot be an email.");
                    }
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isGoodLength(value) {
                    if (value.length < 3 || value.length > 256) {
                        throw new Error('Email must be between 3 - 256 characters');
                    }
                },
                isEmail: true
            }
        },
        hashedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [60, 60]
            }
        },
    }, {
        sequelize,
        modelName: "User",
        defaultScope: {
            attributes: {
                exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
            }
        },
    });
    return User;
};
//# sourceMappingURL=01-users.js.map