"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesRouter = void 0;
const node_fs_1 = require("node:fs");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const filesController_1 = require("../controllers/filesController");
const authController_1 = require("../controllers/authController");
const FILES_PATH = 'public/';
const router = (0, express_1.Router)();
exports.filesRouter = router;
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        (0, node_fs_1.mkdirSync)(FILES_PATH, { recursive: true });
        cb(null, FILES_PATH);
    },
    filename: (_req, file, cb) => {
        const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
        cb(null, `${Date.now()}.${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/', authController_1.authMiddleware, upload.single('file'), filesController_1.uploadFile);
//# sourceMappingURL=filesRoute.js.map