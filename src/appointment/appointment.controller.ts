import { Request, Response } from 'express';
import {
  controller,
  httpGet,
  httpPost,
} from 'inversify-express-utils';
import { Appointment } from 'src/database/types';
import ValidateRequestMiddleware from 'src/middlewares/validate-request-body-middleware';
import BaseHttpResponse from '../helpers/base-http-response';
import AppointmentService from './appointment.service';
import CreateAppointmentDto from './dtos/create-appointment.dto';

@controller('/appointments')
export default class AppointmentController {
  constructor(private readonly _appointmentService: AppointmentService) { }

  @httpPost('/', ValidateRequestMiddleware.with(CreateAppointmentDto))
  async createAppointment(
    _req: Request,
    _res: Response,
  ): Promise<Response> {
    const appointment: Appointment = await this._appointmentService.create(
      _req.body as CreateAppointmentDto,
    );
    const response: BaseHttpResponse = BaseHttpResponse.success(appointment, 201);
    return _res.status(response.statusCode).send(response);
  }

  @httpGet('/')
  async findAll(
    _req: Request,
    _res: Response,
  ): Promise<Response> {
    const appointments: Appointment[] = await this._appointmentService.findAll({
      appointmentStartDate: _req.query.startDate,
      appointmentEndDate: _req.query.endDate,
    });
    const response: BaseHttpResponse = BaseHttpResponse.success(appointments, 200);
    return _res.status(response.statusCode).send(response);
  }
}
