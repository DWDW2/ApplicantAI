import { Request, Response } from 'express';
import CriticalService from '../services/critical.service';
import { criticalTestType } from '../types/useCritical.types';
import criticalTestModel from '../models/critical.models';

export default class CriticalController {
  private criticalService: CriticalService;

  constructor(criticalService: CriticalService) {
    this.criticalService = criticalService;
  }

  async getCritical(req: Request, res: Response) {
    try {
      const result = await this.criticalService.getCriticalData();
      // const f: criticalTestType[] = await this.criticalService.removeDoubleBackslashNewline(
      //   result.text()
      // );
     
      const test = await this.criticalService.saveCriticalDataToDB(result);
      if(test){
        res.json({id: test._id})
      }else{
        res.status(500).send('Error saving critical data to database')
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async getAllCritical(req: Request, res: Response) {
    try {
      const criticalData = await this.criticalService.getAllCriticalData();
      res.json(criticalData);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async getCriticalById(req: Request, res: Response) {
    try {
      const criticalData = await this.criticalService.getCriticalDataById(
        req.params.id
      );
      if (!criticalData) {
        return res.status(404).send('Critical data not found');
      }
      res.json(criticalData);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async createCritical(req: Request, res: Response) {
    try {
      const newCriticalData = await this.criticalService.createCriticalData(
        req.body.test
      );
      res.status(201).json(newCriticalData);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async updateCritical(req: Request, res: Response) {
    try {
      const updatedCriticalData = await this.criticalService.updateCriticalData(req.params.id, req.body);

      const test = await criticalTestModel.findById(req.params.id);

      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
  
      const results = [];
      for (let i = 0; i < test.test.length; i++) {
        const question = test.test[i];
        const userAnswer = req.body[Number(question.id)]; 
        const isCorrect = userAnswer === question.options[Number(question.answer)-1]; // Compare userAnswer with the correct answer from the question object

        results.push({
          questionId: question.id,
          isCorrect: isCorrect,
        });
      }

      return res.status(200).json({ results });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }  
  }

  async deleteCritical(req: Request, res: Response) {
    try {
      const deleted = await this.criticalService.deleteCriticalData(
        req.params.id
      );
      if (!deleted) {
        return res.status(404).send('Critical data not found');
      }
      res.json({ message: 'Critical data deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
