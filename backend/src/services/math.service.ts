import { model } from "../core/config/gemini";
import { partsMath } from "../core/promts/getPrompts";
import { generationConfig, safetySetting } from "../core/config/gemini";
import { mathTestModelType, mathTestType } from "../types/useMath.types";
import MathModel from "../models/math.models"; 

export default class MathService {
  async getMathData() {
    const errorType = {
        id: '',
        question: '',
        questionType: '',
        explanation: '',
        options: '',
        correct_option: '',
        svg_file: '',
    };
    const results: mathTestType[] = [];
    let i = 0;
    while (results.length < 30) {
      i++;
      const res = await model.generateContent({
        contents: [{ role: "user", parts: partsMath }],
        generationConfig,
        safetySettings: safetySetting,
      });
      const formattedResponse = await this.removeDoubleBackslashNewline(
        res.response.text()
      );
      console.log(formattedResponse)
      if (JSON.stringify(formattedResponse) === JSON.stringify(errorType)) {
        i--;
        continue;
      }
      formattedResponse.id = String(i);
      results.push(formattedResponse);
    }
    return results;
  }

  async removeDoubleBackslashNewline(str: any): Promise<mathTestType> {
    try {
      const formattedStr = JSON.parse(str.trim());
      return formattedStr;
    } catch (e) {
      console.log(e);
      return {
        id: '',
        question: '',
        questionType: '',
        explanation: '',
        options: [],
        correct_option: '',
        svg_file: '',
      }
    }
  }

  async formatDataUsingAi(str: string) {
    try {
      const prompt = `${str} format this string. You need to return clear json without any markdown. I need this clear json for web site`;
      const res = await model.generateContent(prompt);
      return res.response.text();
    } catch (err) {
      console.log(err);
    }
  }
  async saveMathDataToDB(data: mathTestType[]) {
    try {
      const test = new MathModel({ test: data });
      await test.save();
      return test;
      console.log("Math data saved to DB");
    } catch (e) {
      console.log(e);
    }
  }

  // CRUD Operations

  // Get all math data
  async getAllMathData(): Promise<mathTestModelType[]> {
    try {
      const mathData = await MathModel.find();
      return mathData;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Get math data by ID
  async getMathDataById(id: string): Promise<mathTestModelType | null> {
    try {
      const mathData = await MathModel.findById(id);
      return mathData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Create new math data
  async createMathData(data: mathTestType[]): Promise<mathTestModelType> {
    try {
      const newMathData = new MathModel({ test: data });
      const savedMathData = await newMathData.save();
      return savedMathData;
    } catch (error) {
      console.log(error);
      throw error; // Re-throw the error to be handled by the controller
    }
  }

  
  async updateMathData(
    id: string,
    data: object
  ): Promise<mathTestModelType | null> {
    try {
      const updatedMathData = await MathModel.findByIdAndUpdate(
        id,
        { answers: data },
        { new: true }
      );
      return updatedMathData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Delete math data by ID
  async deleteMathData(id: string): Promise<boolean> {
    try {
      const deletedMathData = await MathModel.findByIdAndDelete(id);
      return !!deletedMathData; // Check if data was deleted
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
