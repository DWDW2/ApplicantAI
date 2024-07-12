"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleApiService = void 0;
const googleapis_1 = require("googleapis");
const gemini_1 = require("../core/config/gemini");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
class GoogleApiService {
    async authGoogleSheets() {
        const filePath = path_1.default.join(__dirname, '..', 'uploads', 'nfac-hackaton-59bae062e270.json');
        const fileContent = (0, fs_1.readFileSync)(filePath, 'utf-8');
        const credentials = JSON.parse(fileContent);
        const clientEmail = credentials.client_email;
        const privateKey = credentials.private_key;
        const auth = new googleapis_1.google.auth.JWT(clientEmail, undefined, privateKey.split(String.raw `\n`).join('\n'), 'https://www.googleapis.com/auth/spreadsheets');
        return auth;
    }
    async getGoogleSheetsData(sheetId, sheetName, ratio) {
        const auth = await this.authGoogleSheets();
        const googleSheetId = sheetId;
        const googleSheetPage = sheetName;
        try {
            const transformArrayToObjects = (input, fields) => {
                return input.map(entry => {
                    let obj = {};
                    fields.forEach((field, index) => {
                        obj[field] = entry[index] || "";
                    });
                    return obj;
                });
            };
            const sheetInstance = googleapis_1.google.sheets({ version: 'v4', auth: auth });
            const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
                auth: auth,
                spreadsheetId: googleSheetId,
                range: `${googleSheetPage}!${ratio}`
            });
            const valuesFromSheet = infoObjectFromSheet.data.values;
            if (!valuesFromSheet) {
                return [];
            }
            const fields = valuesFromSheet[0] ? valuesFromSheet[0] : [];
            const input = valuesFromSheet.slice(1);
            const transformedData = transformArrayToObjects(input, fields);
            globalThis.__GLOBAL_VAR__.handleDataArray(transformedData);
            return transformedData;
        }
        catch (err) {
            console.log("readSheet func() error", err);
        }
    }
    async appendDataToGoogleSheet(data, sheetId, sheetName, ratio) {
        const auth = await this.authGoogleSheets();
        const sheetInstance = googleapis_1.google.sheets({ version: 'v4', auth: auth });
        const assessment = data.map(applicant => {
            return [
                applicant.assessment.github_profile.criteria_met,
                applicant.assessment.github_profile.evaluation,
                applicant.assessment.programming_experience.criteria_met,
                applicant.assessment.programming_experience.evaluation,
                applicant.assessment.overall_assessment.approved,
                applicant.assessment.overall_assessment.explanation,
                applicant.assessment.overall_assessment.experience_level
            ];
        });
        console.log(assessment);
        try {
            const response = sheetInstance.spreadsheets.values.append({
                auth: auth,
                spreadsheetId: sheetId,
                range: `${sheetName}!${ratio}`,
                valueInputOption: 'RAW',
                resource: {
                    values: assessment
                }
            });
            console.log('Data appended to Google Sheet:', response);
        }
        catch (err) {
            console.log('appendDataToGoogleSheet func() error', err);
        }
    }
    async checkAiGoogleSheets(link, page, ratio) {
        const data = await this.getGoogleSheetsData(link, page, ratio);
        console.log(link, page);
        console.log("data", globalThis.__GLOBAL_VAR__.Prompt);
        const parts = globalThis.__GLOBAL_VAR__.Prompt;
        const result = await gemini_1.model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: gemini_1.generationConfig,
        });
        await this.appendDataToGoogleSheet(JSON.parse(result.response.text()), link, page, 'W1:Y');
        return result;
    }
    async extractSpreadsheetId(url) {
        const match = url.match(/spreadsheets\/d\/([^\/]+)/);
        if (match && match[1]) {
            return match[1];
        }
        return '';
    }
}
exports.GoogleApiService = GoogleApiService;
//# sourceMappingURL=googleapi.service.js.map