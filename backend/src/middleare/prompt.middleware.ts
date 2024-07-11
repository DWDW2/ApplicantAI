import { Request, Response, NextFunction } from "express";
import { GoogleApiService } from "../services/googleapi.service";

export const promptMiddleware = (googleApiService: GoogleApiService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.prompt) {
      globalThis.__GLOBAL_VAR__.MentorPrompts.push(req.body.prompt)
    }
    next();
  };
};
