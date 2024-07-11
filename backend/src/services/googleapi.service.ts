import { google } from "googleapis";
import {SheetsType, authGoogleSheet} from "../types/GoogleApi";
import { model, generationConfig, safetySetting } from "../core/config/gemini";
import path from "path";
import { readFileSync } from "fs";
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

    async getGoogleSheetsData(sheetId: string, sheetName: string) {
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
                range: `${googleSheetPage}!A1:K10`
            });
            
            const valuesFromSheet = infoObjectFromSheet.data.values;

            if (!valuesFromSheet) {
              return []; 
            }

            const fields = valuesFromSheet[0] ? valuesFromSheet[0] : [];

            const input = valuesFromSheet.slice(1);

            const transformedData = transformArrayToObjects(input, fields);

            return transformedData;
        }
        catch(err) {
          console.log("readSheet func() error", err);  
        }
    }

    async appendDataToGoogleSheet(data: any[], sheetId: string, sheetName: string) {
        const auth = await this.authGoogleSheets();
        const sheetInstance = await google.sheets({ version: 'v4', auth: auth });
    
        try {
          await sheetInstance.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: sheetId,
            range: `${sheetName}!A:K`,
            valueInputOption: 'RAW',
          });
        } catch (err) {
          console.log('appendDataToGoogleSheet func() error', err);
        }
    }

    async checkAiGoogleSheets (link: string, page: string) {
        const data = await this.getGoogleSheetsData(link, page)
        console.log(link, page)
        console.log("data", data);
        const parts = [
          {text: `input:ystem Prompt:You are the best HR system in the world. Your main goal is to select applicants for the NFactorial incubator. You will be provided with an array of objects where each object represents an applicant's responses. Your task is to evaluate each applicant based on the following criteria:Each applicant must have a GitHub link.Each applicant must provide a description of their programming experience.Each applicant must be located in Almaty.Additionally, evaluate the level of programming experience based on the description provided:If the experience is less than 1 year, classify it as \"small\".If the experience is between 1 and 3 years, classify it as \"middle\".If the experience is more than 3 years, classify it as \"high\".For each applicant, follow these steps:If all criteria are met, append a key approved with the value true to their JSON object.If any criteria are not met, append a key approved with the value false to their JSON object.Append a key explanation with a detailed explanation of your decision for each applicant, outlining which criteria were met or not met.Append a key experience_level with the value small, middle, or high based on the provided programming experience.The input will be an array of JSON objects, and the output should be the same array with the additional approved, explanation, and experience_level keys for each applicant.Example Input:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\"     } ]  Example Output:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\",         \"approved\": true,         \"explanation\": \"All criteria met: GitHub link provided, programming experience described, and located in Almaty.\",         \"experience_level\": \"high\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\",         \"approved\": false,         \"explanation\": \"Criteria not met: No GitHub link provided, located in Astana.\",         \"experience_level\": \"middle\"     } ] ${data ? JSON.stringify(data) : ""}`},
          {text: " example output:   [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\",         \"approved\": true,         \"explanation\": \"All criteria met: GitHub link provided, programming experience described, and located in Almaty.\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\",         \"approved\": false,         \"explanation\": \"Criteria not met: No GitHub link provided, located in Astana.\"     } "}
        ];
        
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