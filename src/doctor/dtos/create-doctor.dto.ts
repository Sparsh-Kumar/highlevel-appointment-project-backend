import Joi from 'joi';
import { DoctorJoiInterface } from '../../database/types';
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

  static from(reqBody: Partial<DoctorJoiInterface>): CreateDoctorDto | never {
    const createDoctorSchema = Joi.object({
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
      value: DoctorJoiInterface
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
