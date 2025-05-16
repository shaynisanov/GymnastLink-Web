"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdTime: {
        type: String,
        required: true,
    },
});
const commentModel = (0, mongoose_1.model)('Comments', commentSchema);
exports.commentModel = commentModel;
//# sourceMappingURL=commentsModel.js.map