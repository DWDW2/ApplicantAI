"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (req, res, next) => {
    res.on('finish', () => {
        console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} ${res.statusCode}`);
    });
    next();
};
exports.logger = logger;
//# sourceMappingURL=logger.js.map