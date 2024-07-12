"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safetySetting = exports.generationConfig = exports.model = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("./env");
const apiKey = env_1.envs.GEMINI_API;
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});
exports.model = model;
const safetySetting = [
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];
exports.safetySetting = safetySetting;
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2097152,
    responseMimeType: "application/json",
};
exports.generationConfig = generationConfig;
//# sourceMappingURL=gemini.js.map