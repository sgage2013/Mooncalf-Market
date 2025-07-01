'use strict';
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
let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = 'Users';
        return queryInterface.bulkInsert('Users', [
            {
                firstName: "SpongeBob",
                lastName: "Squarepants",
                email: "spongebob@aa.io",
                username: "Spongebob",
                hashedPassword: "$2a$10$RWA3t0FVaTYW1AOKNz5La.3jZDoe0RRqfZ3GFIIrmuNxnjHS0bxu6"
            },
            {
                firstName: "Patrick",
                lastName: "Star",
                email: "Patrick@Star.com",
                username: "PatrickStar",
                hashedPassword: "$2a$10$3LIv4Lvl2vpNWiQceaGh0uabDJomSvSetIJanpEzualAkKd9Nbbmm"
            },
            {
                firstName: "Joe",
                lastName: "Smith",
                email: "demo@aa.io",
                username: "demo",
                hashedPassword: "$2a$10$RWA3t0FVaTYW1AOKNz5La.3jZDoe0RRqfZ3GFIIrmuNxnjHS0bxu6"
            },
        ], options);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = 'Users';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete('Users', {
            username: { [Op.in]: [''] }
        }, options);
    })
};
//# sourceMappingURL=01-user-seeders.js.map