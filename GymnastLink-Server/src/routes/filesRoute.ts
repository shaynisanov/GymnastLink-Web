import {mkdirSync} from 'node:fs';
import {Router} from 'express';
import multer from 'multer';
import {uploadFile} from '../controllers/filesController';
import {authMiddleware} from '../controllers/authController';

const FILES_PATH = 'public/';
const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    mkdirSync(FILES_PATH, {recursive: true});
    cb(null, FILES_PATH);
  },
  filename: (_req, file, cb) => {
    const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({storage});

router.post('/', authMiddleware, upload.single('file'), uploadFile);

export {router as filesRouter};
