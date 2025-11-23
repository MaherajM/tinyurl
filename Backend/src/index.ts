import logger from './lib/logger';
import * as DBUtils from './lib/db.utils';
import * as ServerUtils from './utils/server.utils';
import config from './config/config';

void (async () => {
  try {
    await DBUtils.connect();
    const app = await ServerUtils.createServer();
    const PORT = config.PORT || 5050;
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
})();