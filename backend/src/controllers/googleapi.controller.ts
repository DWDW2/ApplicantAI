import { Request, Response } from "express";
import { GoogleApiService } from "../services/googleapi.service";
import { link, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export default class GoogleSheetsController {
  private googleApiService: GoogleApiService;

  constructor(googleApiService: GoogleApiService) {
    this.googleApiService = googleApiService;
  }
  async getSheetData(req:Request, res: Response){
    const link = await this.googleApiService.extractSpreadsheetId(req.body.link)
    const pageName = req.body.page
    const sheetData = await this.googleApiService.getGoogleSheetsData(link, pageName);
    res.json(sheetData);
  }

  async uploadJson(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const filePath = join(__dirname, '..', 'uploads', file.originalname);
      writeFileSync(filePath, file.buffer);

      res.json({ message: 'JSON data uploaded successfully' });
    } catch (error) {
      console.error('Error uploading JSON data:', error);
      res.status(500).json({ message: 'Error uploading JSON data' });

    }
  }

  async appendDataToGoogleSheet ( req: Request, res: Response) {
    try{
      await this.googleApiService.appendDataToGoogleSheet(req.body,'1UnpnbrYFZq-0HRd5ruhZOuWXrWQ6kByVV5qK83HprRQ', 'Hackathon nf2024 incubator2' )
      res.status(200).json({message: 'Data appended successfully'})
    }catch(err){
      res.status(500).json({message: err})
    }
  }

  async chechWithAiGoogleSheets (req: Request, res: Response) {
    try{
      const link = await this.googleApiService.extractSpreadsheetId(req.body.link)
      const pageName = req.body.page
      const result = await this.googleApiService.checkAiGoogleSheets(link, pageName)
      const json = result.response.text()
      const resultJson = JSON.parse(json)
      res.status(200).json(resultJson)
    }catch(err){
      res.status(500).json({message: err})
    }
  }


  async changePrompt(req: Request, res: Response){
    const result = await this.googleApiService.changeGlobalPrompt(req.body.dataArray ,req.body.prompt)
    res.status(200).json({message: result})
  }
}

