import { google } from "googleapis";
import {ResultObject, SheetsType, authGoogleSheet} from "../types/GoogleApi";
import { model, generationConfig, safetySetting } from "../core/config/gemini";
import path from "path";
import { readFileSync } from "fs";
import Prompt from "../types/Global";
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
   
            const sheetInstance = await google.sheets({ version: 'v4', auth: auth});

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

    // async appendDataToGoogleSheet(data: any[], sheetId: string, sheetName: string, ratio: string) {
    //     const auth = await this.authGoogleSheets();
    //     const sheetInstance = await google.sheets({ version: 'v4', auth: auth });
    
    //     try {
    //       // Extract the column letter from the ratio
    //       const columnLetter = ratio.match(/([A-Z]+)\d+/)[1];
    //       const appendRange = `${sheetName}!${columnLetter}:${columnLetter}`; // Append to the extracted column

    //       await sheetInstance.spreadsheets.values.append({
    //         auth: auth,
    //         spreadsheetId: sheetId,
    //         range: appendRange,
    //         valueInputOption: 'RAW',
    //         values: [[aiResponses]], // Add the AI responses as a new row
    //       });
    //     } catch (err) {
    //       console.log('appendDataToGoogleSheet func() error', err);
    //     }
    // }

    async checkAiGoogleSheets (link: string, page: string, ratio:string) {
        const data = await this.getGoogleSheetsData(link, page, ratio)
        console.log(link, page)
        console.log("data", globalThis.__GLOBAL_VAR__.Prompt);
        const parts = globalThis.__GLOBAL_VAR__.Prompt
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: generationConfig,
          });
          return result;
          
    }
    async  extractSpreadsheetId(url: string): Promise<string> {
      const match = url.match(/spreadsheets\/d\/([^\/]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return '';
    }
}