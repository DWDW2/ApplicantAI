import { model } from "../core/config/gemini";
import {partsCritical} from "../core/promts/getPrompts";
import { generationConfig, safetySetting } from "../core/config/gemini";
import { criticalTestModelType, criticalTestType } from "../types/useCritical.types";
import criticalTestModel from "../models/critical.models"; // Import your Mongoose model

export default class CriticalService {
    async getCriticalData() {
    const errorType = {
        id: "",
        question: "",
        statement: "",
        options: [],
        answer: "",
        explanation: "",
        table: null,
        questionType: ""
    }
    const results: criticalTestType[] = [];
    let i = 0
    while (results.length < 30) {
        i++
      const res = await model.generateContent({
        contents: [{'role': 'user', parts:partsCritical}],
        generationConfig,
        safetySettings: safetySetting
      });
      const formattedResponse = await this.removeDoubleBackslashNewline(res.response.text());
      if(JSON.stringify(formattedResponse) === JSON.stringify(errorType)){
        i--
        continue
      }
      formattedResponse.id = String(i)
      results.push(formattedResponse);
    }
    return results;
    
    } 
    async removeDoubleBackslashNewline(str: any): Promise<criticalTestType> {
        try{
            const formattedStr = JSON.parse(str)
            return formattedStr
        }catch(e){
            console.log(e)
            return {
                id: "",
                question: "",
                statement: "",
                options: [],
                answer: "",
                explanation: "",
                table: null,
                questionType: ""
            }
        }
    }

    async formatDataUsingAi(str: string) {
        try{
            const prompt = `${str} format this string. You need to return clear json without any markdown. I need this clear json for web site`
            const res = await model.generateContent(prompt)
            return res.response.text()
        }catch(err){
            console.log(err)
        }
    }
    async saveCriticalDataToDB(data: criticalTestType[]){
        try{
            const test = new criticalTestModel({test: data})
            await test.save()
            return test
            console.log('Critical data saved to DB')
        }catch(e){
            console.log(e)
        }
    }

    async getAllCriticalData(): Promise<criticalTestModelType[]> {
        try {
            const criticalData = await criticalTestModel.find();
            return criticalData;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    async getCriticalDataById(id: string): Promise<criticalTestModelType | null> {
        try {
            const criticalData = await criticalTestModel.findById(id);
            return criticalData;
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    async createCriticalData(data: criticalTestType[]): Promise<criticalTestModelType> {
        try {
            const newCriticalData = new criticalTestModel({ test: data });
            const savedCriticalData = await newCriticalData.save();
            return savedCriticalData;
        } catch (error) {
            console.log(error);
            throw error; 
        }
    }


    async updateCriticalData(id: string, data: criticalTestModelType): Promise<criticalTestModelType | null> {
        try {
            const updatedCriticalData = await criticalTestModel.findByIdAndUpdate(
                id,
                {answers: data},
                { new: true }
            );
            return updatedCriticalData;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteCriticalData(id: string): Promise<boolean> {
        try {
            const deletedCriticalData = await criticalTestModel.findByIdAndDelete(id);
            return !!deletedCriticalData; 
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
