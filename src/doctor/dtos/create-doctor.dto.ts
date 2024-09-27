import Joi from 'joi';
import { uuid as uuidv4 } from 'uuidv4';
import { Doctor } from '../../database/types';
import ValidationException from '../../exceptions/validation-exception-handler';

export default class CreateDoctorDto {
  public readonly name: string;

  public readonly email: string;

  constructor(
    name: string,
    email: string,
  ) {
    this.name = name;
    this.email = email;
  }

  static from(reqBody: Partial<Doctor>): CreateDoctorDto | never {
    const createDoctorSchema = Joi.object({
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

    const {
      error,
      value,
    } = <{
      error: Joi.ValidationError,
      value: Doctor
    }>createDoctorSchema.validate(reqBody);
    if (error) {
      throw new ValidationException(`Validation error: ${error.message}`);
    }

    return new CreateDoctorDto(
      value.name,
      value.email,
    );
  }
}
