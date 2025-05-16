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
const mongoose_1 = require("mongoose");
const server_1 = require("../server");
const prepareTests_1 = require("./prepareTests");
let app;
let userAccessToken = '';
let userId = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.initializeExpress)();
    const user = yield (0, prepareTests_1.prepareUserForTests)(app);
    userAccessToken = user.accessToken;
    userId = user._id;
}));
describe('UsersController', () => {
    describe('getUserById', () => {
        test('returns user data when user is found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${userAccessToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', userId);
            expect(response.body).toHaveProperty('userName');
            expect(response.body).toHaveProperty('profileImageUrl');
        }));
        test('returns 404 when user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get(`/users/${new mongoose_1.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${userAccessToken}`);
            expect(response.status).toBe(404);
            expect(response.text).toBe('User not found');
        }));
        test('returns 400 on error', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/users/invalid_id')
                .set('Authorization', `Bearer ${userAccessToken}`);
            expect(response.status).toBe(400);
        }));
    });
    describe('updateProfileImage', () => {
        test('updates profile image and returns updated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .put('/users/profile-picture')
                .send({ userId, imageUrl: 'new-url' })
                .set('Authorization', `Bearer ${userAccessToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('profileImageUrl', 'new-url');
        }));
    });
    describe('updateUserName', () => {
        test('updates username and returns updated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .put('/users/username')
                .send({ userId, userName: 'new-username' })
                .set('Authorization', `Bearer ${userAccessToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('userName', 'new-username');
        }));
    });
});
//# sourceMappingURL=users.test.js.map