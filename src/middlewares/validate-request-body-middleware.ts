/* eslint-disable no-param-reassign */
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { DtoClass, LooseObject } from '../helpers/types';

import BaseMiddleware from '../helpers/base-middleware';

export default class ValidateRequestMiddleware extends BaseMiddleware {
  private readonly _dtoClass: DtoClass;

  constructor(dtoClass: DtoClass) {
    super();
    this._dtoClass = dtoClass;
  }

  public execute = (
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ): void => {
    _req.body = this._dtoClass.from(_req.body as LooseObject);
    _next();
  };

  public static with = (dto: DtoClass) => new ValidateRequestMiddleware(dto).execute;
}
