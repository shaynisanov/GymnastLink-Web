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
const usersModel_1 = require("../models/usersModel");
class UsersController extends baseController_1.BaseController {
    constructor() {
        super(usersModel_1.userModel);
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const user = yield this.model.findById(id);
                if (user) {
                    const userResponse = {
                        _id: user._id.toString(),
                        userName: user.userName,
                        profileImageUrl: user.profileImageUrl,
                    };
                    res.send(userResponse);
                }
                else {
                    res.status(404).send('User not found');
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    updateProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield usersModel_1.userModel.findOneAndUpdate({ _id: req.body.userId }, { $set: { profileImageUrl: req.body.imageUrl } }, { new: true });
                if (updatedUser) {
                    res.status(200).send(updatedUser);
                }
                else {
                    res.status(404).json({ error: 'User not found' });
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    updateUserName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield usersModel_1.userModel.findOneAndUpdate({ _id: req.body.userId }, { $set: { userName: req.body.userName } }, { new: true });
                if (updatedUser) {
                    res.status(200).send(updatedUser);
                }
                else {
                    res.status(404).json({ error: 'User not found' });
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = new UsersController();
//# sourceMappingURL=usersController.js.map