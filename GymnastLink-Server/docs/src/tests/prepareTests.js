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
exports.testUserDetails = exports.prepareUserForTests = void 0;
const usersModel_1 = require("../models/usersModel");
const supertest_1 = __importDefault(require("supertest"));
const testUserDetails = {
    email: 'testuser@example.com',
    password: 'password123',
    username: 'test-user',
};
exports.testUserDetails = testUserDetails;
const prepareUserForTests = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield usersModel_1.userModel.deleteOne({ userName: 'test-user' });
    yield (0, supertest_1.default)(app).post('/auth/register').send(testUserDetails);
    const loginResponse = yield (0, supertest_1.default)(app)
        .post('/auth/login')
        .send(testUserDetails);
    return loginResponse.body;
});
exports.prepareUserForTests = prepareUserForTests;
//# sourceMappingURL=prepareTests.js.map