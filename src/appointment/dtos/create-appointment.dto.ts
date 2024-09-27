import Joi from 'joi';
import { AppointmentJoiInterface } from '../../database/types';
import ValidationException from '../../exceptions/validation-exception-handler';

export default class CreateAppointmentDto {
  public readonly doctorId: string;

  public readonly patientName: string;

  public readonly appointmentDate: string;

  public readonly appointmentStartTime: string;

  public readonly appointmentDuration: number;

  public readonly notes: string;

  constructor(
    doctorId: string,
    patientName: string,
    appointmentDate: string,
    appointmentStartTime: string,
    appointmentDuration: number,
    notes: string,
  ) {
    this.doctorId = doctorId;
    this.patientName = patientName;
    this.appointmentDate = appointmentDate;
    this.appointmentStartTime = appointmentStartTime;
    this.appointmentDuration = appointmentDuration;
    this.notes = notes;
  }

  static from(reqBody: Partial<AppointmentJoiInterface>): CreateAppointmentDto | never {
    const createAppointmentSchema = Joi.object({
      doctorId: Joi.string()
        .required(),
      patientName: Joi.string()
        .min(1)
        .max(100)
        .required(),
      appointmentDate: Joi.string()
        .required(),
      appointmentStartTime: Joi.string()
        .required(),
      appointmentDuration: Joi.number()
        .integer()
        .positive()
        .required(),
      notes: Joi.string()
        .max(500)
        .optional()
        .default(''),
    });

    const {
      error,
      value,
    } = <{
      error: Joi.ValidationError,
      value: AppointmentJoiInterface
    }>createAppointmentSchema.validate(reqBody);
    if (error) {
      throw new ValidationException(`Validation error: ${error.message}`);
    }

    return new CreateAppointmentDto(
      value.doctorId,
      value.patientName,
      value.appointmentDate,
      value.appointmentStartTime,
      value.appointmentDuration,
      value.notes,
    );
  }
}
