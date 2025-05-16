"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    profileImageUrl: String,
    refreshToken: {
        type: [String],
        default: [],
    },
});
const userModel = (0, mongoose_1.model)('Users', userSchema);
exports.userModel = userModel;
//# sourceMappingURL=usersModel.js.map