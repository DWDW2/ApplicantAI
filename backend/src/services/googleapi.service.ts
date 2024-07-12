import { google } from "googleapis";
import {ResultObject, SheetsType, authGoogleSheet} from "../types/GoogleApi";
import { model, generationConfig, safetySetting } from "../core/config/gemini";
import path from "path";
import { readFileSync } from "fs";
import Prompt from "../types/Global";
import Applicant from "../types/Applicant";
export class GoogleApiService {
    async authGoogleSheets () {
        const filePath = path.join(__dirname, '..', 'uploads', 'nfac-hackaton-59bae062e270.json');
        const fileContent = readFileSync(filePath, 'utf-8');
        const credentials = JSON.parse(fileContent);

        const clientEmail = credentials.client_email;
        const privateKey = credentials.private_key;

        const auth = new google.auth.JWT(
            clientEmail,
            undefined,
            privateKey.split(String.raw`\n`).join('\n'),
            'https://www.googleapis.com/auth/spreadsheets'
        );

        return auth
    }
    
    async getGoogleSheetsData(sheetId: string, sheetName: string, ratio: string) {
        const auth = await this.authGoogleSheets()
        const googleSheetId = sheetId;
        const googleSheetPage = sheetName;
        try {
            type ResultObject = {
              [key: string]: string;
            };
            
            const transformArrayToObjects = (input: string[][], fields: string[]): ResultObject[] => {
              return input.map(entry => {
                let obj: ResultObject = {};
                fields.forEach((field, index) => {
                  obj[field] = entry[index] || "";
                });
                return obj;
              });
            };
   
            const sheetInstance = google.sheets({ version: 'v4', auth: auth });

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

            globalThis.__GLOBAL_VAR__.handleDataArray(transformedData)
            return transformedData;
        }
        catch(err) {
          console.log("readSheet func() error", err);  
        }
    }

    async appendDataToGoogleSheet(data: Applicant[], sheetId: string, sheetName: string, ratio: string) {
        const auth = await this.authGoogleSheets();
        const sheetInstance = google.sheets({ version: 'v4', auth: auth });
        const assessment =  data.map(applicant => {
          return [
            applicant.assessment.github_profile.evaluation,
            applicant.assessment.programming_experience.evaluation,
            applicant.assessment.overall_assessment.approved,
            applicant.assessment.overall_assessment.explanation,
            applicant.assessment.overall_assessment.experience_level
          ];
        })
        console.log(assessment)
        try {
          const response = sheetInstance.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: sheetId,
            range: `${sheetName}!${ratio}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: assessment,
            },
          });
    
          console.log('Data appended to Google Sheet:', response);
        } catch (err) {
          console.log('appendDataToGoogleSheet func() error', err);
        }
    }

    async checkAiGoogleSheets (link: string, page: string, ratio:string, ratioToInsert: string) {
        const data = await this.getGoogleSheetsData(link, page, ratio)
        console.log(link, page)
        console.log("data", globalThis.__GLOBAL_VAR__.Prompt);
        const parts = globalThis.__GLOBAL_VAR__.Prompt
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: generationConfig,
          });

          await this.appendDataToGoogleSheet(JSON.parse(result.response.text()), link, page, ratioToInsert)
          return result;
    }

    async useMentorPrompts (link: string, page: string, ratio:string, ratioToInsert: string, mentorPrompt: string) {
      const data = await this.getGoogleSheetsData(link, page, ratio)
      if(data){
        globalThis.__GLOBAL_VAR__.handleDataArray(data, mentorPrompt)
        const parts = globalThis.__GLOBAL_VAR__.Prompt
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: generationConfig,
          });

          await this.appendDataToGoogleSheet(JSON.parse(result.response.text()), link, page, ratioToInsert)
          return result;
      }
    }
    async  extractSpreadsheetId(url: string): Promise<string> {
      const match = url.match(/spreadsheets\/d\/([^\/]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return '';
    }
}