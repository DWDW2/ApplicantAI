import { Request, Response, NextFunction } from 'express';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

export const hasFilesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const uploadsDir = join(__dirname, '..', 'uploads');

  if (existsSync(uploadsDir) && readdirSync(uploadsDir).length > 0) {
    next(); 
  } else {
    res.status(400).json({ message: 'No files found in the uploads directory' });
  }
};
