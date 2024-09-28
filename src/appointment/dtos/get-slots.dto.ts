import Joi from 'joi';
import ValidationException from '../../exceptions/validation-exception-handler';
import { GetFreeSlots, TimeZones } from '../types';

export default class GetFreeSlotsDto {
  public readonly doctorId: string;

  public readonly date: string;

  public readonly timeZone: string;

  constructor(
    doctorId: string,
    date: string,
    timeZone: string,
  ) {
    this.doctorId = doctorId;
    this.date = date;
    this.timeZone = timeZone;
  }

  static from(reqBody: Partial<GetFreeSlots>): GetFreeSlotsDto | never {
    const createAppointmentSchema = Joi.object({
      doctorId: Joi.string()
        .required(),
      date: Joi.string()
        .required()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .messages({
          'string.pattern.base': 'Date must be in YYYY-MM-DD format',
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
      value: GetFreeSlots,
    }>createAppointmentSchema.validate(reqBody);
    if (error) {
      throw new ValidationException(`Validation error: ${error.message}`);
    }

    return new GetFreeSlotsDto(
      value.doctorId,
      value.date,
      value.timeZone,
    );
  }
}
