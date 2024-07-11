import express, { type Request, type Response } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import GoogleApiRoute from './routes/googleapi.route'
import cors from 'cors';
import { HttpCode, ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants/index';
import { logger } from './logger';
interface ServerOptions {
 port: number;
}

export class Server {
 private readonly app = express();
 private readonly port: number;
 constructor(options: ServerOptions) {
  const { port } = options;
  this.port = port;
 }

 async start(): Promise<void> {
  this.app.use(express.json()); 
  this.app.use(express.urlencoded({ extended: true })); 
  this.app.use(compression());
  this.app.use(cors())
  this.app.use(logger)

  this.app.use('/google', GoogleApiRoute)
  this.app.get('/health', (_req: Request, res: Response) => {
   return res.status(HttpCode.OK).send({
    message: 'Server is healthy'
   });
  });

  this.app.get('/error', (_req: Request, res: Response) => {
   return res.status(HttpCode.INTERNAL_SERVER_ERROR).send({
    message: 'Internal Server Error'
   });
  });

  this.app.listen(this.port, () => {
   console.log(`Server running on port ${this.port}...`);
  });
 }
}