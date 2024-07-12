"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasFilesMiddleware = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const hasFilesMiddleware = (req, res, next) => {
    const uploadsDir = (0, path_1.join)(__dirname, '..', 'uploads');
    if ((0, fs_1.existsSync)(uploadsDir) && (0, fs_1.readdirSync)(uploadsDir).length > 0) {
        if (req.body.prompt) {
            globalThis.__GLOBAL_VAR__.MentorPrompts.push(req.body.prompt);
        }
        next();
    }
    else {
        res.status(400).json({ message: 'No files found in the uploads directory' });
    }
};
exports.hasFilesMiddleware = hasFilesMiddleware;
//# sourceMappingURL=json.middleware.js.map