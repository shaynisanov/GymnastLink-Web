"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const port = process.env.PORT;
(0, server_1.initializeExpress)().then((app) => {
    if (process.env.NODE_ENV != 'production') {
        app.listen(port, () => {
            console.log(`GymnastLink app listening at http://localhost:${port}`);
        });
    }
    else {
        const options = {
            key: fs_1.default.readFileSync('../../client-key.pem'),
            cert: fs_1.default.readFileSync('../../client-cert.pem'),
        };
        https_1.default.createServer(options, app).listen(port);
    }
});
//# sourceMappingURL=app.js.map