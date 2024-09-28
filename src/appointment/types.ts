import { Moment } from 'moment';
import { Appointment } from '../database/types';

export interface SlotInformation {
  slotStartingTime: string | Moment;
  slotEndingTime: string | Moment;
}

export interface FireBaseAppointmentInfo extends Appointment {
  id: string;
}

export enum TimeZones {
  ASIA = 'Asia/Kolkata',
  LOS_ANGELES = 'America/Los_Angeles',
}
