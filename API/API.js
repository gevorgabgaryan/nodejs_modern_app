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
import LRU from 'lru-cache'; // Import lru-cache library

class API {
  static async init() {
    const app = express();
    const passport = SetupPassport();
    const cache = new LRU(); // Create an instance of lru-cache

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

    // Middleware for caching
    app.use((req, res, next) => {
      const key = req.originalUrl || req.url;
      const cachedData = cache.get(key);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      // If not in cache, proceed to the route handler
      next();
    });

    // Add data to cache after the route handler
    app.use((req, res, next) => {
      const key = req.originalUrl || req.url;
      const responseData = res.locals.data; // You should replace this with the actual response data
      cache.set(key, responseData);
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
