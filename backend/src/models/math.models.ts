import mongoose, { Document, Schema } from 'mongoose';
import { mathTestModelType } from '../types/useMath.types';

interface IMathTestModel extends Omit<mathTestModelType, 'id'>, Document {}

const mathTestSchema: Schema = new Schema({
    test: [{
        id: { type: String, required: true },
        question: { type: String, required: true },
        questionType: { type: String, required: true },
        explanation: { type: String, required: true },
        options: { type: Array, required: true },
        correct_option: { type: String, required: true },
        svg_file: { type: String, default: null }
    }],
    answers: {
        type: Object,
        required: true,
        default: {},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

mathTestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const MathTestModel = mongoose.model<IMathTestModel>('MathTest', mathTestSchema);

export default MathTestModel;
