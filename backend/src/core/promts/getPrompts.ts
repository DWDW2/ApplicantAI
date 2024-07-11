import { systemPromptCritical, systemPromptMath } from "../config/gemini";

const partsCritical = [
  {text: systemPromptCritical+'Generate a JSON object containing a practice question aimed at developing critical thinking skills for the National University Entrance Test (NUET). The question should present a complex scenario of at least 130 words, exploring diverse themes and requiring thoughtful analysis. Include diverse viewpoints and data to enhance the challenge. Emphasize logical reasoning, including drawing conclusions and identifying logical fallacies from data and arguments. Encourage examining situations from multiple perspectives for a nuanced understanding. Optionally, include an HTML table for data analysis, featuring high-level tasks. The output should be a single JSON object.'},
  {text: ""},
];

const partsMath = [
  {text: systemPromptMath + 'Generate a JSON object containing a practice question aimed at developing math questions. The output should be a single JSON object'},
  {text: ""},
];


export {partsCritical, partsMath};
