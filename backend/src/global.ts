import { model, generationConfig, safetySetting } from './core/config/gemini';
import Prompt from './types/Global';
export const handleDataArray = async (dataArray: any[], prompt?: Prompt) => {
  if (!dataArray || dataArray.length === 0) {
    return [];
  }

  const parts = [
    {
      text: `System Prompt:You are the best HR system in the world. Your main goal is to select applicants for the NFactorial incubator. You will be provided with an array of objects where each object represents an applicant's responses. Your task is to evaluate each applicant based on the following criteria:Each applicant must have a GitHub link.Each applicant must provide a description of their programming experience.Each applicant must be located in Almaty.Additionally, evaluate the level of programming experience based on the description provided:If the experience is less than 1 year, classify it as \"small\".If the experience is between 1 and 3 years, classify it as \"middle\".If the experience is more than 3 years, classify it as \"high\".For each applicant, follow these steps:If all criteria are met, append a key approved with the value true to their JSON object.If any criteria are not met, append a key approved with the value false to their JSON object.Append a key explanation with a detailed explanation of your decision for each applicant, outlining which criteria were met or not met.Append a key experience_level with the value small, middle, or high based on the provided programming experience.The input will be an array of JSON objects, and the output should be the same array with the additional approved, explanation, and experience_level keys for each applicant.Example Input:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\"     } ]  Example Output:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\",         \"approved\": true,         \"explanation\": \"All criteria met: GitHub link provided, programming experience described, and located in Almaty.\",         \"experience_level\": \"high\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\",         \"approved\": false,         \"explanation\": \"Criteria not met: No GitHub link provided, located in Astana.\",         \"experience_level\": \"middle\"     } ] ${dataArray ? JSON.stringify(dataArray) : ""}`
    },
    { text: " example output:   [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\",         \"approved\": true,         \"explanation\": \"All criteria met: GitHub link provided, programming experience described, and located in Almaty.\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\",         \"approved\": false,         \"explanation\": \"Criteria not met: No GitHub link provided, located in Astana.\"     } "},
  ];

  if (prompt) {
    parts.shift()
    parts[0] = prompt;
  }
};
