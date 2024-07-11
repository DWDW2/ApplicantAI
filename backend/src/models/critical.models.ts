import mongoose, { Document, Schema } from 'mongoose';
import { criticalTestModelType } from '../types/useCritical.types';

interface ICriticalTestModel extends Omit<criticalTestModelType, 'id'>, Document {}

const criticalTestShema: Schema = new Schema({
    test: [{
        id: { type: String, required: true },
        question: { type: String, required: true },
        statement: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: String, required: true },
        explanation: { type: String, required: true },
        table: { type: String, default: null },
        questionType: { type: String, required: true }
    }],
    answers:{
        type: Object,
        required: true,
        default: {},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
     // camelCase for consistency
});

const criticalTestModel = mongoose.model<ICriticalTestModel>('criticalTest', criticalTestShema);

export default criticalTestModel;
