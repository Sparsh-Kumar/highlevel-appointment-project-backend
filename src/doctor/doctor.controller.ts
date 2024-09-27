import { Request, Response } from 'express';
import {
  controller,
  httpGet,
  httpPost,
} from 'inversify-express-utils';
import BaseHttpResponse from '../helpers/base-http-response';
import ValidateRequestMiddleware from '../middlewares/validate-request-body-middleware';
import { Doctor } from '../database/types';
import DoctorService from './doctor.service';
import CreateDoctorDto from './dtos/create-doctor.dto';

@controller('/doctors')
export default class DoctorController {
  constructor(private readonly _doctorService: DoctorService) { }

  @httpGet('/')
  async getAllDoctors(
    _req: Request,
    _res: Response,
  ): Promise<Response> {
    const doctors: Doctor[] = await this._doctorService.findAll({});
    const response: BaseHttpResponse = BaseHttpResponse.success(doctors, 200);
    return _res.status(response.statusCode).send(response);
  }

  @httpGet('/:id')
  async getParticularDoctor(
    _req: Request,
    _res: Response,
  ): Promise<Response> {
    const doctor: Doctor = await this._doctorService.findById(_req.params.id);
    const response: BaseHttpResponse = BaseHttpResponse.success(doctor, 200);
    return _res.status(response.statusCode).send(response);
  }

  @httpPost('/', ValidateRequestMiddleware.with(CreateDoctorDto))
  async createNewDoctor(
    _req: Request,
    _res: Response,
  ): Promise<Response> {
    const doctor: Doctor = await this._doctorService.create(_req.body as CreateDoctorDto);
    const response: BaseHttpResponse = BaseHttpResponse.success(doctor, 201);
    return _res.status(response.statusCode).send(response);
  }
}
