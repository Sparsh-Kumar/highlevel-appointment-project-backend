import { Request, Response } from 'express';
import {
  controller,
  httpGet,
} from 'inversify-express-utils';
import HealthCheckService from './healthcheck.service';

@controller('/healthcheck')
export default class HealthCheckController {
  constructor(private readonly _healthCheckService: HealthCheckService) { }

  @httpGet('/')
  async getHealthCheckStatus(
    _req: Request,
    _res: Response,
  ): Promise<string> {
    return this._healthCheckService.healthCheck();
  }
}
