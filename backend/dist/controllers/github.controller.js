"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRepos = void 0;
const github_service_1 = require("../services/github.service");
const reviewRepos = async (req, res) => {
    const { url, limit } = req.body;
    try {
        const result = await (0, github_service_1.reviewGithubRepos)(url, limit);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in controller:', error.message);
        res.status(500).send('Internal Server Error');
    }
};
exports.reviewRepos = reviewRepos;
//# sourceMappingURL=github.controller.js.map