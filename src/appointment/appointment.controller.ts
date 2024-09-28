import { Request, Response } from 'express';
import {
  controller,
  httpPost,
} from 'inversify-express-utils';
import { Appointment } from '../database/types';
import ValidateRequestMiddleware from '../middlewares/validate-request-body-middleware';
import BaseHttpResponse from '../helpers/base-http-response';
import AppointmentService from './appointment.service';
import CreateAppointmentDto from './dtos/create-appointment.dto';
import GetAllAppointmentsDto from './dtos/get-all-appointment.dto';
import GetFreeSlotsDto from './dtos/get-slots.dto';
import { SlotInformation } from './types';

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

  @httpPost('/all', ValidateRequestMiddleware.with(GetAllAppointmentsDto))
  async getAllAppointments(
    _req: Request,
    _res: Response,
  ): Promise<Response> {
    const appointments: Appointment[] = await this._appointmentService.findAll(
      _req.body as GetAllAppointmentsDto,
    );
    const response: BaseHttpResponse = BaseHttpResponse.success(appointments, 200);
    return _res.status(response.statusCode).send(response);
  }

  @httpPost('/slots', ValidateRequestMiddleware.with(GetFreeSlotsDto))
  async getFreeSlots(
    _req: Request,
    _res: Response,
  ): Promise<Response> {
    const slots: SlotInformation[] = await this._appointmentService.freeSlots(
      _req.body as GetFreeSlotsDto,
    );
    const response: BaseHttpResponse = BaseHttpResponse.success(slots, 200);
    return _res.status(response.statusCode).send(response);
  }
}
