import Joi from 'joi';
import { injectable } from 'inversify';
import { uuid as uuidv4 } from 'uuidv4';
import { Doctor } from '../types';

@injectable()
export default class DoctorModal {
  private readonly _doctorSchema = Joi.object({
    _id: Joi.string()
      .guid({ version: 'uuidv4' })
      .default(uuidv4),
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .required(),
  });

  public validateDocument(doctor: Doctor): Doctor | never {
    const {
      error,
      value,
    } = <{
      error: Joi.ValidationError,
      value: Doctor
    }> this._doctorSchema.validate(doctor);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
    return value;
  }
}
