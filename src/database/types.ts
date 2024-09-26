export interface Doctor {
  _id: string;
  name: string;
  email: string;
}

export interface Appointment {
  _id: string;
  notes: string;
  doctorId: string;
  patientName: string;
  appointmentStartTime: Date;
  appointmentEndTime: Date;
}
