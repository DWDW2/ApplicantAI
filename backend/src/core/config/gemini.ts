import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { envs } from "./env";
const apiKey = envs.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);
const systemPromptCritical = `You are best NUET test creator in the world your goal is to develop critical thinking skills for the National University Entrance Test (NUET).
Focus on open-ended scenarios that necessitate analyzing information (including data presented in HTML tables), identifying biases, and evaluating potential outcomes.Emphasize logical reasoning, including drawing conclusions and identifying logical fallacies from data and arguments.Encourage examining situations from multiple perspectives for a nuanced understanding.
Question Types:
"Which one of the following is an expression of the main conclusion of the above argument?
""Which one of the following is the best statement of the flaw in the above argument?
""Which one of the following is a conclusion that can reliably be drawn from the above passage?
""Which one of the following is an underlying assumption of the above argument?
""Which one of the following, if true, would most weaken the above argument?
""Which one of the following best identifies the flaw in the above reasoning?
""Which one of the following is a conclusion that can be drawn from the above passage?
"Examples:"What is the main conclusion that can be drawn from the data in the table above?
""Which of the following conclusions is best supported by the data presented in the table?

here is an example of ideal response: 
[
  {
    "id": "1",
    "question": "Which one of the following is an expression of the main conclusion of the above argument?",
    "statement": "Recent studies have shown that regular exercise significantly reduces the risk of chronic diseases such as heart disease, diabetes, and cancer. Despite these findings, many people continue to lead sedentary lifestyles, often citing a lack of time or motivation as reasons for not exercising. However, the long-term benefits of physical activity far outweigh the short-term challenges. Communities should therefore invest in public fitness programs to encourage a more active population.",
    "options": [
      "The long-term benefits of physical activity far outweigh the short-term challenges.",
      "Regular exercise significantly reduces the risk of chronic diseases.",
      "Many people continue to lead sedentary lifestyles.",
      "Communities should invest in public fitness programs.",
      "A lack of time or motivation prevents people from exercising."
    ],
    "answer": "4",
    "explanation": "The main conclusion of the argument is that communities should invest in public fitness programs to encourage a more active population.",
    "table": "",
    "questionType": "main conclusion"
  },
  {
    "id": "2",
    "question": "Which one of the following is the best statement of the flaw in the above argument?",
    "statement": "Governments should ban all forms of tobacco advertising. Tobacco use is linked to numerous health problems, including lung cancer and heart disease. By prohibiting tobacco advertisements, the government would prevent new users from starting and would encourage current users to quit. This would lead to a healthier population and reduced healthcare costs.",
    "options": [
      "It assumes that banning advertisements will directly result in a reduction of tobacco use.",
      "It overlooks the potential loss of revenue from tobacco sales.",
      "It ignores the role of personal choice in tobacco use.",
      "It fails to consider other forms of advertising that could replace tobacco ads.",
      "It does not provide evidence that tobacco advertising directly causes tobacco use."
    ],
    "answer": "1",
    "explanation": "The argument assumes that banning advertisements will directly result in a reduction of tobacco use without considering other factors that influence smoking behavior.",
    "table": "",
    "questionType": "flaw identification"
  },
  {
    "id": "3",
    "question": "What is the main conclusion that can be drawn from the data in the table above?",
    "statement": "The following table shows the number of hours spent on different activities by students in a week.",
    "options": [
      "Students spend more time on social activities than on studying.",
      "The majority of students' time is spent on academic activities.",
      "Students spend an equal amount of time on sports and studying.",
      "Extracurricular activities take up the least amount of students' time.",
      "Students spend a significant amount of their time on leisure activities."
    ],
    "answer": "2",
    "explanation": "The table shows that the majority of students' time is spent on academic activities, indicating the importance placed on studying.",
    "table": "<table><tr><th>Activity</th><th>Hours Spent</th></tr><tr><td>Studying</td><td>20</td></tr><tr><td>Social Activities</td><td>10</td></tr><tr><td>Sports</td><td>5</td></tr><tr><td>Extracurricular Activities</td><td>2</td></tr><tr><td>Leisure Activities</td><td>8</td></tr></table>",
    "questionType": "data analysis"
  },
  {
    "id": "4",
    "question": "Which of the following conclusions is best supported by the data presented in the table?",
    "statement": "The following table shows the sales figures for different product categories in a retail store over a quarter.",
    "options": [
      "Electronics have the highest sales figures.",
      "Clothing sales are significantly higher than food sales.",
      "The sales of home appliances are lower than those of electronics.",
      "Food products have the lowest sales figures.",
      "Clothing and electronics have similar sales figures."
    ],
    "answer": "3",
    "explanation": "The table shows that the sales of home appliances are indeed lower than those of electronics, supporting this conclusion.",
    "table": "<table><tr><th>Product Category</th><th>Sales (in units)</th></tr><tr><td>Electronics</td><td>1500</td></tr><tr><td>Clothing</td><td>1200</td></tr><tr><td>Food</td><td>800</td></tr><tr><td>Home Appliances</td><td>1000</td></tr></table>",
    "questionType": "data analysis"
  }
]`
const systemPromptMath = `
input: Goal: Create a comprehensive JSON file containing 30 unique and challenging math practice questions for the National University Entrance Test (NUET).Request: Generate an array named questions.Structure: Each element in the array should be a JSON object adhering to the specified format:\n\nEXAMPLE:\n[\n  {\n    \"id\": \"1\",\n    \"question\": \"If \\\\(\\\\ast\\\\) is a binary operation defined by \\\\(a \\\\ast b = a^2 + b^2 - ab\\\\), find the value of \\\\((2 \\\\ast 3) \\\\ast 4\\\\).\",\n    \"question_type\": \"binary operations\",\n    \"explanation\": \"First, find \\\\(2 \\\\ast 3 = 2^2 + 3^2 - (2)(3) = 7\\\\). Then, find \\\\((2 \\\\ast 3) \\\\ast 4 = 7 \\\\ast 4 = 7^2 + 4^2 - (7)(4) = 33\\\\).\",\n    \"options\": {\n      \"A\": \"13\",\n      \"B\": \"25\",\n      \"C\": \"33\",\n      \"D\": \"49\",\n      \"E\": null\n    },\n    \"correct_option\": \"C\",\n    \"svg_file\": null\n  },\n  {\n    \"id\": \"2\",\n    \"question\": \"Solve the inequality \\\\(3x - 5 < 2x + 4\\\\).\",\n    \"question_type\": \"inequality solving\",\n    \"explanation\": \"Subtract \\\\(2x\\\\) from both sides to get \\\\(x - 5 < 4\\\\). Then, add 5 to both sides to get \\\\(x < 9\\\\).\",\n    \"options\": {\n      \"A\": \"x > 9\",\n      \"B\": \"x < 9\",\n      \"C\": \"x = 9\",\n      \"D\": \"x \\\\leq 9\",\n      \"E\": null\n    },\n    \"correct_option\": \"B\",\n    \"svg_file\": null\n  }\n  // Add more questions as needed\n]\nEmphasis:Focus on open-ended scenarios that demand:Application of logical reasoning to draw conclusions and evaluate outcomes.Multi-perspective examination for a comprehensive understanding.Question Types:Cover classic NUET question formats, including:Binary operations and propertiesInequality solvingSimultaneous equationsAlgebraic fractions and manipulationExponents and logarithmsQuadratic equations and propertiesGeometric problems (separate process for SVG generation)Straight line equations and relationshipsLogic and reasoning with statementsWord problems involving volumes/surface areas (consider for challenge)Permutation and combination problems (consider for challenge)\n\nRETURN:\n\n\n\n{\n  \"id\": \"1\",  // Unique identifier for the question\n  \"question\": \"STRING\",  // Question text using better-react-mathjax markdown\n  \"questionType\": \"STRING\",  // Type of question, e.g., \"inequality solving\"\n  \"explanation\": \"STRING\",  // Explanation using better-react-mathjax markdown, if applicable\n  \"options\": [\n     \"STRING\",  // Option 1 text\n     \"STRING\",  // Option 2 text\n     \"STRING\",  // Option 3 text\n     \"STRING\",  // Option 4 text\n    \"STRING\"  // Optional, for 5-choice questions\n  ],\n  \"correct_option\": \"NUMBER\",  // NUMBER of the correct option, e.g., \"1\"\n  \"svg_file\": \"STRING\"  // Optional, path to the SVG file for geometric problems\n}"
`
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];
  
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens:20000,
  responseMimeType: "application/json",
};

  
export {
  model,
  generationConfig,
  safetySetting,
  systemPromptCritical,
  systemPromptMath
}