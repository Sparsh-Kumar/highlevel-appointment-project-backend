import { Moment } from 'moment';
import * as mz from 'moment-timezone';

export default function convertIntoApplicationTimeZone(
  formattedDateString: string,
  timeZone: string,
): Moment {
  const dateStringAcqToTz = mz.tz(
    formattedDateString,
    timeZone,
  );
  return dateStringAcqToTz.clone().tz(
    process.env.APPLICATION_TIMEZONE,
  );
}
