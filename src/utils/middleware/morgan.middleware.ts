import { AppLogger } from '@/utils/logger/logger.service.js';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(MorganMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const morganHandler = morgan('dev', {
      stream: {
        write: (str) => {
          this.logger.log(str);
          // this.logger.log(`Operation:\n ${JSON.stringify(req.body, undefined, 4)}`)
        },
      },
    });
    morganHandler(req, res, next);
  }
}
