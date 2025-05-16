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
const prepareTests_1 = require("./prepareTests");
let app;
let userAccessToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.initializeExpress)();
    const user = yield (0, prepareTests_1.prepareUserForTests)(app);
    userAccessToken = user.accessToken;
}));
describe('FilesController', () => {
    it('should upload a file successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/files')
            .attach('file', Buffer.from('test file content'), 'testfile.txt')
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('url');
    }));
    it('should return 400 if no file is uploaded', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/files')
            .set('Authorization', `Bearer ${userAccessToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'No file uploaded');
    }));
    it('should return 401 if no authorization token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/files')
            .attach('file', Buffer.from('test file content'), 'testfile.txt');
        expect(response.status).toBe(401);
    }));
    it('should return 401 if an invalid authorization token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/files')
            .attach('file', Buffer.from('test file content'), 'testfile.txt')
            .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(401);
    }));
});
//# sourceMappingURL=files.test.js.map