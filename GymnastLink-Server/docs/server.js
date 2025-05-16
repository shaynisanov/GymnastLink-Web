"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeExpress = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const postsRoutes_1 = require("./routes/postsRoutes");
const commentsRoutes_1 = require("./routes/commentsRoutes");
const usersRoutes_1 = require("./routes/usersRoutes");
require("dotenv/config");
const swaggerConfig_1 = require("./swaggerConfig");
const authRoutes_1 = require("./routes/authRoutes");
const filesRoute_1 = require("./routes/filesRoute");
const workoutsRoutes_1 = require("./routes/workoutsRoutes");
const app = (0, express_1.default)();
const db = mongoose_1.default.connection;
db.once('open', () => console.log('Connected to GymnastLink database'));
db.on('error', (error) => console.error(error));
app.use((0, body_parser_1.json)({ limit: '50mb' }));
app.use((0, cors_1.default)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use(express_1.default.static('public'));
app.use(express_1.default.static('front'));
app.use('/posts', postsRoutes_1.postRouter);
app.use('/comments', commentsRoutes_1.commentRouter);
app.use('/auth', authRoutes_1.authRouter);
app.use('/users', usersRoutes_1.userRouter);
app.use('/files', filesRoute_1.filesRouter);
app.use('/workouts', workoutsRoutes_1.workoutRouter);
(0, swaggerConfig_1.setupSwagger)(app);
const initializeExpress = () => new Promise((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
        reject('DB_CONNECT is not defined in .env file');
    }
    else {
        mongoose_1.default
            .connect(process.env.DB_CONNECT)
            .then(() => {
            resolve(app);
        })
            .catch((error) => {
            reject(error);
        });
    }
});
exports.initializeExpress = initializeExpress;
//# sourceMappingURL=server.js.map