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
    const ratio = req.body.ratio
    const sheetData = await this.googleApiService.getGoogleSheetsData(link, pageName, ratio);
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

  async chechWithAiGoogleSheets (req: Request, res: Response) {
    try{
      const link = await this.googleApiService.extractSpreadsheetId(req.body.link)
      const pageName = req.body.page
      const ratio = req.body.ratio
      const ratioToInsert = req.body.ratioToInsert
      const result = await this.googleApiService.checkAiGoogleSheets(link, pageName, ratio, ratioToInsert)
      const json = result.response.text()
      const resultJson = JSON.parse(json)
      res.status(200).json(resultJson)
    }catch(err){
      res.status(500).json({message: err})
    }
  }
  async implementMentorPrompt(req: Request, res: Response){
    try{
      const link = await this.googleApiService.extractSpreadsheetId(req.body.link)
      const pageName = req.body.page
      const ratio = req.body.ratio
      const ratioToInsert = req.body.ratioToInsert
      const mentorPrompt = req.body.mentorPrompt
      const result = await this.googleApiService.useMentorPrompts(link, pageName, ratio, ratioToInsert, mentorPrompt)
      if(result){
        const resJson = JSON.parse(result?.response.text())
        res.status(200).json(resJson)
      }else{
        res.status(500).json({message: 'Error'})
      }
    }catch(err){
      console.log(err)
      res.status(500).json({message: err})  
    }
  }
}

