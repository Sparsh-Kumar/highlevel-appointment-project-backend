export interface Doctor {
  name: string;
  email: string;
}

export interface Appointment {
  notes: string;
  doctorId: string;
  patientName: string;
  appointmentDate: Date;
  appointmentStartTime: Date;
  appointmentEndTime: Date;
  appointmentDuration: number;
}

export interface DoctorJoiInterface {
  name: string;
  email: string;
}

export interface AppointmentJoiInterface {
  notes: string;
  doctorId: string;
  patientName: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentDuration: number;
  timeZone: string;
}
