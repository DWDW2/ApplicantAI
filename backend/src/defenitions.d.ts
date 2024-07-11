import Prompt from "./types/Global";
import { ResultObject } from "./types/GoogleApi";

declare global {
    var __GLOBAL_VAR__: {
          Prompt: string | GenerateContentRequest | (string | Part)[];
          handleDataArray: (dataArray: ResultObject[], prompt?: string) => void;
          MentorPrompts: string[]
    };

  }
  
  export {};