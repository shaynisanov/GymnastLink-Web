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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const mongoose_1 = __importDefault(require("mongoose"));
const WorkoutsModel_1 = require("../models/WorkoutsModel");
const usersModel_1 = require("../models/usersModel");
const prepareTests_1 = require("./prepareTests");
let app;
let workoutId = '';
let userId = '';
let userAccessToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.initializeExpress)();
    yield WorkoutsModel_1.workoutModel.deleteMany();
    yield usersModel_1.userModel.deleteMany();
    const user = yield (0, prepareTests_1.prepareUserForTests)(app);
    userAccessToken = user.accessToken;
    userId = user._id;
    const workoutResponse = yield (0, supertest_1.default)(app)
        .post('/workouts')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
        title: 'Test Workout',
        content: 'This is a test workout',
        createdTime: new Date().toISOString(),
    });
    workoutId = workoutResponse.body._id;
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe('Workouts Tests', () => {
    test('get all workouts by user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/workouts')
            .set('Authorization', `Bearer ${userAccessToken}`)
            .query({ filter: userId });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(workoutId);
    }));
    test('create workout', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/workouts')
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
            title: 'Test Workout',
            content: 'This is a test workout',
            createdTime: new Date().toISOString(),
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe('This is a test workout');
        expect(response.body.userId).toBe(userId);
        expect(response.body.createdTime).toBeDefined();
    }));
    test('plan workout', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/workouts/plan')
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
            title: 'Test Workout',
            content: 'Test Content',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    }));
    test('delete workout', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/workouts/${workoutId}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
    }));
    test('fail to get all workouts by user without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/workouts')
            .query({ filter: userId });
        expect(response.statusCode).toBe(401);
    }));
    test('fail to create workout without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/workouts').send({
            title: 'Unauthorized Workout',
            content: 'This workout should not be created',
        });
        expect(response.statusCode).toBe(401);
    }));
    test('fail to plan workout without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/workouts/plan').send({
            title: 'Unauthorized Workout',
            content: 'This workout should not be planned',
        });
        expect(response.statusCode).toBe(401);
    }));
    test('fail to delete workout without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/workouts/${workoutId}`);
        expect(response.statusCode).toBe(401);
    }));
    test('fail to delete non-existent workout', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/workouts/${new mongoose_1.default.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=workouts.test.js.map