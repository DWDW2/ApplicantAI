import { EnhancedGenerateContentResponse } from '@google/generative-ai';
import MathService from '../services/math.service';
import { Request, Response } from 'express';
import { mathTestModelType } from '../types/useMath.types';
import MathTestModel from '../models/math.models';
export default class MathController {
    private mathService: MathService
    
    constructor(mathService: MathService) {
        this.mathService = mathService;
    }

    async getMath(req: Request, res: Response) {
        try {
            const result = await this.mathService.getMathData()
            const test = await this.mathService.saveMathDataToDB(result)
            if (test) {
                res.json({id: test._id});
                return {id: test._id}
            } else {
                res.status(500).send('Error saving math data to database');
                return null;
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getAllMath(req: Request, res: Response) {
        try {
            const mathData = await this.mathService.getAllMathData();
            res.json(mathData);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }

    async getMathById(req: Request, res: Response) {
        try {
            const mathData = await this.mathService.getMathDataById(req.params.id);
            if (!mathData) {
                return res.status(404).send('Math data not found');
            }
            res.json(mathData);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }

    async createMath(req: Request, res: Response) {
        try {
            const newMathData = await this.mathService.createMathData(req.body.answer);
            res.status(201).json(newMathData);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }

    async updateMath(req: Request, res: Response) {
        try {
            const updatedMathData = await this.mathService.updateMathData(req.params.id, req.body);
  
            const test = await MathTestModel.findById(req.params.id);
  
            if (!test) {
              return res.status(404).json({ message: 'Test not found' });
            }
        
            const results = [];
            for (let i = 0; i < test.test.length; i++) {
              const question = test.test[i];
              const userAnswer = req.body[Number(question.id)]; 
              const isCorrect = userAnswer === question.options[Number(question.correct_option)-1]; // Compare userAnswer with the correct answer from the question object
                
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

    async deleteMath(req: Request, res: Response) {
        try {
            const deleted = await this.mathService.deleteMathData(req.params.id);
            if (!deleted) {
                return res.status(404).send('Math data not found');
            }
            res.json({ message: 'Math data deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}
