"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class GoogleSheetsController {
    googleApiService;
    constructor(googleApiService) {
        this.googleApiService = googleApiService;
    }
    async getSheetData(req, res) {
        const link = await this.googleApiService.extractSpreadsheetId(req.body.link);
        const pageName = req.body.page;
        const ratio = req.body.ratio;
        const sheetData = await this.googleApiService.getGoogleSheetsData(link, pageName, ratio);
        res.json(sheetData);
    }
    async uploadJson(req, res) {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            const filePath = (0, path_1.join)(__dirname, '..', 'uploads', file.originalname);
            (0, fs_1.writeFileSync)(filePath, file.buffer);
            res.json({ message: 'JSON data uploaded successfully' });
        }
        catch (error) {
            console.error('Error uploading JSON data:', error);
            res.status(500).json({ message: 'Error uploading JSON data' });
        }
    }
    async chechWithAiGoogleSheets(req, res) {
        try {
            const link = await this.googleApiService.extractSpreadsheetId(req.body.link);
            const pageName = req.body.page;
            const ratio = req.body.ratio;
            const result = await this.googleApiService.checkAiGoogleSheets(link, pageName, ratio);
            const json = result.response.text();
            const resultJson = JSON.parse(json);
            res.status(200).json(resultJson);
        }
        catch (err) {
            res.status(500).json({ message: err });
        }
    }
}
exports.default = GoogleSheetsController;
//# sourceMappingURL=googleapi.controller.js.map