import Joi from 'joi';
import ValidationException from '../../exceptions/validation-exception-handler';
import { GetAllAppointments, TimeZones } from '../types';

export default class GetAllAppointmentsDto {
  public readonly startDate: string;

  public readonly endDate: string;

  public readonly doctorId: string;

  public readonly timeZone: string;

  constructor(
    startDate: string,
    endDate: string,
    doctorId: string,
    timeZone: string,
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.doctorId = doctorId;
    this.timeZone = timeZone;
  }

  static from(reqBody: Partial<GetAllAppointments>): GetAllAppointmentsDto | never {
    const createAppointmentSchema = Joi.object({
      doctorId: Joi.string()
        .required(),
      startDate: Joi.string()
        .required()
        .pattern(/^\d{4}-\d{2}-\d{2}$/) // Regex for YYYY-MM-DD format
        .messages({
          'string.pattern.base': 'startDate must be in YYYY-MM-DD format',
        }),
      endDate: Joi.string()
        .required()
        .pattern(/^\d{4}-\d{2}-\d{2}$/) // Regex for YYYY-MM-DD format
        .messages({
          'string.pattern.base': 'endDate must be in YYYY-MM-DD format',
        }),
      timeZone: Joi.string()
        .valid(
          TimeZones.ASIA,
          TimeZones.LOS_ANGELES,
        )
        .default(TimeZones.ASIA)
        .required(),
    });

    const {
      error,
      value,
    } = <{
      error: Joi.ValidationError,
      value: GetAllAppointments,
    }>createAppointmentSchema.validate(reqBody);
    if (error) {
      throw new ValidationException(`Validation error: ${error.message}`);
    }

    return new GetAllAppointmentsDto(
      value.startDate,
      value.endDate,
      value.doctorId,
      value.timeZone,
    );
  }
}
