"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const uploadFile = (req, res) => {
    if (!req.file) {
        res.status(400).send({ error: 'No file uploaded' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const file = req.file;
    const fileUrl = `${baseUrl}/${file.filename}`;
    res.status(200).send({ url: fileUrl });
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=filesController.js.map