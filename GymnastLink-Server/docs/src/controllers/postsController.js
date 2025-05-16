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
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = require("./baseController");
const postsModel_1 = require("../models/postsModel");
const commentsModel_1 = require("../models/commentsModel");
const usersModel_1 = require("../models/usersModel");
class PostsController extends baseController_1.BaseController {
    constructor() {
        super(postsModel_1.postModel);
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.query.userId;
            try {
                let posts;
                if (userId) {
                    posts = yield this.model.find({ userId });
                }
                else {
                    posts = yield this.model.find();
                }
                const mappedPost = yield Promise.all(posts.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const commentCount = yield commentsModel_1.commentModel.countDocuments({
                        postId: item._id,
                    });
                    const postUser = yield usersModel_1.userModel.findById(item.userId);
                    return Object.assign(Object.assign({}, item.toObject()), { commentCount, user: {
                            _id: postUser === null || postUser === void 0 ? void 0 : postUser._id.toString(),
                            userName: postUser === null || postUser === void 0 ? void 0 : postUser.userName,
                            profileImageUrl: postUser === null || postUser === void 0 ? void 0 : postUser.profileImageUrl,
                        } });
                })));
                res.send(mappedPost);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const post = yield this.model.findById(id);
                if (post) {
                    const commentCount = yield commentsModel_1.commentModel.countDocuments({
                        postId: post._id,
                    });
                    const postUser = yield usersModel_1.userModel.findById(post.userId);
                    res.send(Object.assign(Object.assign({}, post.toObject()), { commentCount, user: {
                            _id: postUser === null || postUser === void 0 ? void 0 : postUser._id.toString(),
                            userName: postUser === null || postUser === void 0 ? void 0 : postUser.userName,
                            profileImageUrl: postUser === null || postUser === void 0 ? void 0 : postUser.profileImageUrl,
                        } }));
                }
                else {
                    res.status(404).send('Post not found');
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    handleLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                const post = yield this.model.findById(postId);
                if (!post) {
                    res.status(404).send('Post not found');
                    return;
                }
                if (post.likes.includes(req.body.userId)) {
                    post.likes = post.likes.filter((id) => id.toString() !== req.body.userId.toString());
                }
                else {
                    post.likes.push(req.body.userId);
                }
                yield post.save();
                res.status(200).send(post);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = new PostsController();
//# sourceMappingURL=postsController.js.map