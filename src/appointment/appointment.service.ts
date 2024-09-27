import moment from 'moment';
import { injectable } from 'inversify';
import { Appointment } from '../database/types';
import AppointmentRepository from './appointment.repository';
import CreateAppointmentDto from './dtos/create-appointment.dto';
import DoctorService from '../doctor/doctor.service';
import NotFoundException from '../exceptions/not-found-exception-handler';
import ValidationException from '../exceptions/validation-exception-handler';

@injectable()
export default class AppointmentService {
  constructor(
    private readonly _doctorService: DoctorService,
    private readonly _appointmentRepository: AppointmentRepository,
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const isDoctorExists = await this._doctorService.findById(createAppointmentDto.doctorId);
    if (!isDoctorExists) throw new NotFoundException(`Doctor with given Id = ${createAppointmentDto.doctorId} not found`);

    const appointmentStartingTime = moment(`${createAppointmentDto.appointmentDate} ${createAppointmentDto.appointmentStartTime}`, 'YYYY-MM-DD HH:mm');
    const appointmentEndingTime = appointmentStartingTime.clone().add(createAppointmentDto.appointmentDuration, 'minutes');

    const doctorDayStart = moment(`${createAppointmentDto.appointmentDate} ${process.env.APPOINTMENT_START_TIMING}`, 'YYYY-MM-DD HH:mm');
    const doctorDayEnd = moment(`${createAppointmentDto.appointmentDate} ${process.env.APPOINTMENT_END_TIMING}`, 'YYYY-MM-DD HH:mm');

    if (appointmentStartingTime.isBefore(doctorDayStart) || appointmentEndingTime.isAfter(doctorDayEnd)) throw new ValidationException('The appointment should be set in the availability time of the doctor.');

    const conflictingAppointments = await this._appointmentRepository.findConflictingAppointments(
      createAppointmentDto,
      appointmentStartingTime.toDate(),
      appointmentEndingTime.toDate(),
    );

    if (conflictingAppointments?.length) throw new ValidationException('Your appointment with the doctor is conflicting with other appointments.');
    return this._appointmentRepository.create(createAppointmentDto);
  }
}
