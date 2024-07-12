"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptMiddleware = void 0;
const promptMiddleware = (googleApiService) => {
    return (req, res, next) => {
        if (req.body.prompt) {
            globalThis.__GLOBAL_VAR__.MentorPrompts.push(req.body.prompt);
        }
        next();
    };
};
exports.promptMiddleware = promptMiddleware;
//# sourceMappingURL=prompt.middleware.js.map