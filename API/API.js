import express from 'express';
import { createServer } from 'http';
import Config from '../config';
import apiRoutes from '../routes/apiRoutes';
import SetupPassport from '../lib/passport';
import cors from 'cors';
import requestLogger from '../shared/requestLogger';
import logger from '../shared/logger';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { responseSender } from '../utils/util';
import { CustomError } from '../shared/error';
import { promisifyAPI } from '../middlewares/promisify';
import compression from 'compression';
 import expressStatusMonitor from 'express-status-monitor';
class API {
  static async init() {
    const app = express();
    const passport = SetupPassport();
    app.use(promisifyAPI());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(cors());
    app.use(compression());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      legacyHeaders: false,
    });
    app.use(limiter);
    app.use(requestLogger);
    app.use(expressStatusMonitor({ path: '/monitor' }));
    app.use(passport.initialize());
    app.use('/api', apiRoutes);
    app.set('env', Config.nodeEnv);

    app.use((req, res) => {
      const message = {
        message: 'API not found',
        method: req.method,
        url: req.originalUrl,
        IP: req.headers['x-forwarded-for'],
      };
      logger.warn(message);
      responseSender(
        new CustomError('API not found', 'API_NOT_FOUND', 400, message),
        res
      );
    });

    app.use(function (req, res, next) {
      const info = {
        url: req.originalUrl,
        IP: req.headers['x-forwarded-for'],
      };
      res.promisify(
        Promise.reject(
          new CustomError('API not found', 'API_NOT_FOUND', 400, info)
        )
      );
    });

    app.use(function (err, req, res, next) {
      res.promisify(Promise.reject(err));
    });

    app.get('/health', (req, res) => {
      res.json({ status: 'OK' });
    });

    const server = createServer(app);

    const port = Config.port;

    server.listen(port, () => {
      logger.info(`Rest server started on port: ${port}`);
    });
    return server;
  }
}

export default API;
