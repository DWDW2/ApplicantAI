import { Document } from "mongoose";
import { mathTestModelType } from "./useMath.types";
type criticalTestType = {
    id: string;
    question: string;
    statement: string;
    options: string[];
    answer: string;
    explanation: string;
    table: string | null;
    questionType: string; // change to camelCase for consistency
}

type criticalTestModelType = {
    test:[{
        id: string;
        question: string;
        statement: string;
        options: string[];
        answer: string;
        explanation: string;
        table: string | null;
        questionType: string; // change to camelCase for consistency
    }],
    answers: object,
    createdAt: string;
    updatedAt: string;
}

export type { criticalTestType, criticalTestModelType };