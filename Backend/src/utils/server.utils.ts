import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from '../lib/logger';
import routes from '../routes/index';

function createServer() {
  return new Promise<Express>((resolve, reject) => {
    try {
      const app: Express = express();

      app.use(cors({ credentials: true, origin: '*' }));

      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

      app.get('/health', (req: Request, res: Response) => {
        res.send({
          status: 'Alive',
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
