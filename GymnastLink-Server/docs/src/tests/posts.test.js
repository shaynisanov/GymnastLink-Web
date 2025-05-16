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
const postsModel_1 = require("../models/postsModel");
const prepareTests_1 = require("./prepareTests");
let app;
let postId = '';
let userId = '';
let userAccessToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.initializeExpress)();
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
describe('Posts Tests', () => {
    test('get all posts', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/posts')
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(postId);
    }));
    test('create post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/posts')
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
            content: 'This is a test post',
            imageUrl: null,
            createdTime: new Date().toISOString(),
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe('This is a test post');
        expect(response.body.userId).toBe(userId);
        expect(response.body.createdTime).toBeDefined();
    }));
    test('get post by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/posts/${postId}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe('This is a test post');
        expect(response.body.userId).toBe(userId);
        expect(response.body.createdTime).toBeDefined();
    }));
    test('update post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/${postId}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
            content: 'Updated test content',
            imageUrl: null,
            createdTime: new Date().toISOString(),
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe('Updated test content');
        expect(response.body.createdTime).toBeDefined();
    }));
    test('like and unlike post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/posts/like/${postId}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
    }));
    test('delete post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${postId}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(200);
    }));
    test('fail to create post without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/posts').send({
            content: 'This post should not be created',
            imageUrl: null,
            createdTime: new Date().toISOString(),
        });
        expect(response.statusCode).toBe(401);
    }));
    test('fail to update non-existent post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/${new mongoose_1.default.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
            content: 'Trying to update non-existent post',
            imageUrl: null,
            createdTime: new Date().toISOString(),
        });
        expect(response.statusCode).toBe(404);
    }));
    test('fail to delete non-existent post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/posts/${new mongoose_1.default.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.statusCode).toBe(404);
    }));
    test('fail to like and unlike post without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(`/posts/like/${postId}`).send({
            title: 'Unauthorized Post',
            content: 'This post should not be liked or unliked',
        });
        expect(response.statusCode).toBe(401);
    }));
});
//# sourceMappingURL=posts.test.js.map