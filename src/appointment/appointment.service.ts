import moment from 'moment';
import { injectable } from 'inversify';
import { LooseObject } from 'src/helpers/types';
import { Appointment } from '../database/types';
import AppointmentRepository from './appointment.repository';
import CreateAppointmentDto from './dtos/create-appointment.dto';
import DoctorService from '../doctor/doctor.service';
import NotFoundException from '../exceptions/not-found-exception-handler';
import ValidationException from '../exceptions/validation-exception-handler';
import { FireBaseAppointmentInfo, SlotInformation } from './types';

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

  async findAll(filter: LooseObject = {}): Promise<FireBaseAppointmentInfo[]> {
    const appointmentStartDate = <string>(filter?.appointmentStartDate);
    const appointmentEndDate = <string>(filter?.appointmentEndDate);
    if (appointmentStartDate && appointmentEndDate && (moment(appointmentEndDate).isBefore(moment(appointmentStartDate)))) throw new ValidationException('Appointment end date should be more than start date.');
    return this._appointmentRepository.findAll(filter);
  }

  async freeSlots(date: string, intervalMinutes = 30): Promise<SlotInformation[]> {
    const doctorDayStart = moment(`${date} ${process.env.APPOINTMENT_START_TIMING}`, 'YYYY-MM-DD HH:mm');
    const doctorDayEnd = moment(`${date} ${process.env.APPOINTMENT_END_TIMING}`, 'YYYY-MM-DD HH:mm');
    let tempStartDate = doctorDayStart.clone();
    const defaultAvailableSlots: SlotInformation[] = [];
    while (tempStartDate < doctorDayEnd) {
      const slotStartingTime = tempStartDate.clone();
      const slotEndingTime = slotStartingTime.add(intervalMinutes, 'minutes');
      defaultAvailableSlots.push({
        slotStartingTime: tempStartDate,
        slotEndingTime,
      });
      tempStartDate = slotEndingTime;
    }
    const availableAppointments: Appointment[] = await this.findAll({
      appointmentStartDate: date,
      appointmentEndDate: date,
    });
    availableAppointments.sort(
      (a, b) => moment(a.appointmentStartTime).diff(moment(b.appointmentStartTime)),
    );
    let slots: SlotInformation[] = defaultAvailableSlots.filter((slot: SlotInformation) => {
      let shouldExcluded = false;
      for (let i = 0; i < availableAppointments?.length; i += 1) {
        const record = availableAppointments[i];
        const appointmentStart = moment(record.appointmentStartTime);
        const appointmentEnd = moment(record.appointmentEndTime);
        if (
          (
            appointmentStart.isAfter(slot.slotStartingTime)
            && appointmentStart.isBefore(slot.slotEndingTime)
          )
          || (
            appointmentEnd.isAfter(slot.slotStartingTime)
            && appointmentEnd.isBefore(slot.slotEndingTime)
          )
          || (appointmentStart.isSame(slot.slotStartingTime))
        ) {
          shouldExcluded = true;
          break;
        }
      }
      return !shouldExcluded;
    });
    slots = slots.map((slot) => ({
      slotStartingTime: moment(slot.slotStartingTime).format('YYYY-MM-DD HH:mm'),
      slotEndingTime: moment(slot.slotEndingTime).format('YYYY-MM-DD HH:mm'),
    }));
    return slots;
  }
}
