'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/database')[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
if (process.env.NODE_ENV === 'development') {
    fs
        .readdirSync(__dirname)
        .filter((file) => {
        return (file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.ts');
    })
        .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });
}
else {
    fs
        .readdirSync(__dirname)
        .filter((file) => {
        return (file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js');
    })
        .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });
}
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
exports.default = db;
//# sourceMappingURL=index.js.map