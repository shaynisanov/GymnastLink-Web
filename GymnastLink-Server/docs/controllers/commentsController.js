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
const commentsModel_1 = require("../models/commentsModel");
const postsModel_1 = require("../models/postsModel");
const baseController_1 = require("./baseController");
class CommentsController extends baseController_1.BaseController {
    constructor() {
        super(commentsModel_1.commentModel);
    }
    create(req, res) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.body.postId;
            try {
                const post = yield postsModel_1.postModel.findById(postId);
                if (!post)
                    res.status(404).send(`Post with id ${postId} was not found`);
                return _super.create.call(this, req, res);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.query.postId;
            try {
                if (postId) {
                    const post = yield postsModel_1.postModel.findById(postId);
                    if (!post)
                        res.status(404).send(`Post with id ${postId} was not found`);
                    const item = yield this.model.find({ postId });
                    res.send(item);
                }
                else {
                    const items = yield this.model.find();
                    res.send(items);
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    deleteCommentsByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.query.postId;
            try {
                yield this.model.deleteMany({ postId });
                res.send(`Comments for post with id ${postId} were deleted`);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = new CommentsController();
//# sourceMappingURL=commentsController.js.map