import { Moment } from 'moment';

export interface SlotInformation {
  slotStartingTime: string | Moment;
  slotEndingTime: string | Moment;
}
