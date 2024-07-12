"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const github_controller_1 = require("../controllers/github.controller");
const router = (0, express_1.Router)();
router.post('/review', github_controller_1.reviewRepos);
exports.default = router;
//# sourceMappingURL=github.route.js.map