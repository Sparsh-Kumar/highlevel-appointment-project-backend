import { injectable } from 'inversify';
import { Doctor } from '../database/types';
import { LooseObject } from '../helpers/types';
import DoctorRepository from './doctor.repository';
import CreateDoctorDto from './dtos/create-doctor.dto';
import { FireBaseDoctorInfo } from './types';

@injectable()
export default class DoctorService {
  constructor(private readonly _doctorRepository: DoctorRepository) { }

  async findAll(filter: LooseObject = {}): Promise<FireBaseDoctorInfo[]> {
    return this._doctorRepository.findAll(filter);
  }

  async findById(id: string): Promise<Doctor> {
    return this._doctorRepository.findById(id);
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this._doctorRepository.create(createDoctorDto);
  }
}
