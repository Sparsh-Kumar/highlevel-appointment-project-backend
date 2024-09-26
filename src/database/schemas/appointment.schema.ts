import Joi from 'joi';
import { injectable } from 'inversify';
import { uuid as uuidv4 } from 'uuidv4';
import { Appointment } from '../types';

@injectable()
export default class AppointmentModal {
  private readonly _appointmentSchema = Joi.object({
    _id: Joi.string()
      .guid({ version: 'uuidv4' })
      .default(uuidv4),
    notes: Joi.string()
      .max(500)
      .optional(),
    doctorId: Joi.string()
      .guid({ version: 'uuidv4' })
      .required(),
    patientName: Joi.string()
      .min(1)
      .max(100)
      .required(),
    appointmentStartTime: Joi.date()
      .iso()
      .required(),
    appointmentEndTime: Joi.date()
      .iso()
      .greater(Joi.ref('appointmentStartTime'))
      .required(),
  });

  public validateDocument(doctor: Appointment): Appointment | never {
    const {
      error,
      value,
    } = <{
      error: Joi.ValidationError,
      value: Appointment
    }> this._appointmentSchema.validate(doctor);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
    return value;
  }
}
