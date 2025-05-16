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
const commentsModel_1 = require("../models/commentsModel");
const postsModel_1 = require("../models/postsModel");
const prepareTests_1 = require("./prepareTests");
let app;
let postId = '';
let userId = '';
let userAccessToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.initializeExpress)();
    yield commentsModel_1.commentModel.deleteMany();
    yield postsModel_1.postModel.deleteMany();
    const user = yield (0, prepareTests_1.prepareUserForTests)(app);
    userAccessToken = user.accessToken;
    userId = user._id;
    const postResponse = yield (0, supertest_1.default)(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
        content: 'This is a test post',
        imageUrl: null,
        createdTime: new Date().toISOString(),
    });
    postId = postResponse.body._id;
}));
afterAll((done) => {
    postsModel_1.postModel.deleteMany({ userId }).then(() => {
        mongoose_1.default.connection.close();
        done();
    });
});
describe('Comments Tests', () => {
    test('get all', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/comments')
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test('create comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/comments')
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
            postId,
            content: 'This is a test comment',
            createdTime: new Date().toISOString(),
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe('This is a test comment');
        expect(response.body.postId).toBe(postId);
        expect(response.body.userId).toBe(userId);
        expect(response.body.createdTime).toBeDefined();
    }));
    test('get comments by postId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/comments?filter=${postId}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe('This is a test comment');
        expect(response.body[0].postId).toBe(postId);
        expect(response.body[0].userId).toBe(userId);
        expect(response.body[0].createdTime).toBeDefined();
    }));
    test('delete comments by postId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comments?postId=${postId}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`Comments for post with id ${postId} were deleted`);
    }));
    test('fail to create comment without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/comments').send({
            postId,
            content: 'This is a test comment without auth',
            createdTime: new Date().toISOString(),
        });
        expect(response.statusCode).toBe(401);
    }));
    test('fail to delete comments by postId without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/comments?postId=${postId}`);
        expect(response.statusCode).toBe(401);
    }));
});
//# sourceMappingURL=comments.test.js.map