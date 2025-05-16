"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutModel = void 0;
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    createdTime: {
        type: String,
        required: true,
    },
});
const workoutModel = (0, mongoose_1.model)('Workouts', workoutSchema);
exports.workoutModel = workoutModel;
//# sourceMappingURL=WorkoutsModel.js.map