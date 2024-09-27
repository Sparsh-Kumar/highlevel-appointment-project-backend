import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import DbService from './database/db.service';
import Application from './helpers/abstract-application';
import BaseHttpResponse from './helpers/base-http-response';
import { ApplicationOptions } from './helpers/types';
import ValidationException from './exceptions/validation-exception-handler';
import NotFoundException from './exceptions/not-found-exception-handler';
import HealthCheckService from './healthcheck/healthcheck.service';
import DoctorService from './doctor/doctor.service';
import DoctorRepository from './doctor/doctor.repository';
import AppointmentService from './appointment/appointment.service';
import AppointmentRepository from './appointment/appointment.repository';

export default class App extends Application {
  private _db: DbService;

  configureService(): void {
    this._container.bind(DbService).toSelf();
    this._container.bind(HealthCheckService).toSelf();
    this._container.bind(DoctorService).toSelf();
    this._container.bind(DoctorRepository).toSelf();
    this._container.bind(AppointmentService).toSelf();
    this._container.bind(AppointmentRepository).toSelf();
  }

  setup(options: ApplicationOptions): void {
    const corsOptions: CorsOptions = {};
    this._db = this._container.get(DbService);
    this._db.initializeApplication();
    const server: InversifyExpressServer = new InversifyExpressServer(this._container);
    server.setConfig((app) => {
      app.use(express.json());
      app.use(morgan(options.morganConfig.format));
      app.use(cors(corsOptions));
    });
    server.setErrorConfig((app) => {
      app.use((
        _err: ValidationException | Error,
        _req: Request,
        _res: Response,
        _next: NextFunction,
      ) => {
        if (_err instanceof ValidationException || _err instanceof NotFoundException) {
          const response: BaseHttpResponse = BaseHttpResponse.failure(
            _err.message,
            _err.statusCode,
          );
          return _res.status(response.statusCode).json(response);
        }

        if (_err instanceof Error) {
          const response: BaseHttpResponse = BaseHttpResponse.failure(
            _err.message,
          );
          return _res.status(response.statusCode).json(response);
        }
        return _next();
      });
    });
    const app = server.build();
    app.listen(process.env.PORT, () => {
      console.log(process.env.WEB_APP_HOST);
    });
  }
}
