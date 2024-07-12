"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleapi_service_1 = require("../services/googleapi.service");
const googleapi_controller_1 = __importDefault(require("../controllers/googleapi.controller"));
const json_middleware_1 = require("../middleare/json.middleware");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
const googleApiService = new googleapi_service_1.GoogleApiService();
const googleSheetsController = new googleapi_controller_1.default(googleApiService);
router.get('/get', json_middleware_1.hasFilesMiddleware, (req, res) => googleSheetsController.getSheetData(req, res));
router.post('/upload-json', upload.single('file'), (req, res) => googleSheetsController.uploadJson(req, res));
router.get('/get-ai-check', json_middleware_1.hasFilesMiddleware, (req, res) => googleSheetsController.chechWithAiGoogleSheets(req, res));
exports.default = router;
//# sourceMappingURL=googleapi.route.js.map