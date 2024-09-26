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
    if (!reqBody.name) {
      throw new ValidationException('Missing property employee name');
    }
    if (!reqBody.email) {
      throw new ValidationException('Missing property email address.');
    }

    return new CreateDoctorDto(
      reqBody.name,
      reqBody.email,
    );
  }
}
