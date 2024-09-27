import { Request, Response } from 'express';
import {
  controller,
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
}
