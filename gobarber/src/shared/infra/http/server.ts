import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';

import { errors } from 'celebrate';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

// importante que fique depois das rotas
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port 3333! 🚀');
});
