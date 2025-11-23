import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from '../lib/logger';
import routes from '../routes/index';

function createServer(): Promise<Express> {
  return new Promise<Express>((resolve, reject) => {
    try {
      const app: Express = express();
      
      app.use(cors({ origin: '*' }));
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      
      app.get('/healthz', (req: Request, res: Response) => {
        res.send({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          message: 'Server is healthy',
        });
      });
      
      app.use('/api', routes);
      
      logger.info('Express server created successfully');
      resolve(app);
    } catch (error) {
      logger.error('Error creating Express server', error);
      reject(error);
    }
  });
}

export { createServer };