"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    imageUrl: String,
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    createdTime: {
        type: String,
        required: true,
    },
    likes: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Users',
        default: [],
    },
});
const postModel = (0, mongoose_1.model)('Posts', postSchema);
exports.postModel = postModel;
//# sourceMappingURL=postsModel.js.map