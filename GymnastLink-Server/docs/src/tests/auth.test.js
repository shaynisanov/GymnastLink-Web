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
const usersModel_1 = require("../models/usersModel");
const prepareTests_1 = require("./prepareTests");
let app;
let refreshToken = '';
const dupUserEmail = 'duplicateuser@example.com';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.initializeExpress)();
    yield usersModel_1.userModel.deleteMany({
        email: [dupUserEmail, prepareTests_1.testUserDetails.email],
    });
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe('Users Tests', () => {
    test('register user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/register').send({
            email: prepareTests_1.testUserDetails.email,
            password: prepareTests_1.testUserDetails.password,
        });
        expect(response.statusCode).toBe(200);
    }));
    test('login user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/login').send({
            email: prepareTests_1.testUserDetails.email,
            password: prepareTests_1.testUserDetails.password,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        refreshToken = response.body.refreshToken;
    }));
    test('fail to register user with existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post('/auth/register').send({
            email: dupUserEmail,
            password: 'password123',
        });
        const response = yield (0, supertest_1.default)(app).post('/auth/register').send({
            email: dupUserEmail,
            password: 'password123',
        });
        expect(response.statusCode).toBe(400);
    }));
    test('fail to login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/login').send({
            email: prepareTests_1.testUserDetails.email,
            password: 'wrongpassword',
        });
        expect(response.statusCode).toBe(401);
    }));
    test('refresh user token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/refresh-token').send({
            refreshToken,
        });
        refreshToken = response.body.refreshToken;
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    }));
    test('fail to refresh token with invalid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/refresh-token').send({
            refreshToken: 'invalidToken',
        });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Invalid refresh token');
    }));
    test('logout user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/logout').send({
            refreshToken,
        });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('logout successfully');
    }));
    test('fail to logout with invalid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/logout').send({
            refreshToken: 'invalidToken',
        });
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe('Invalid refresh token');
    }));
});
//# sourceMappingURL=auth.test.js.map