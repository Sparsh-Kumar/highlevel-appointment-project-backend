import moment from 'moment';
import { injectable } from 'inversify';
import {
  doc,
  query,
  DocumentSnapshot,
  addDoc,
  QueryFieldFilterConstraint,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { LooseObject } from 'src/helpers/types';
import DbService from '../database/db.service';
import CreateAppointmentDto from './dtos/create-appointment.dto';
import { Appointment } from '../database/types';
import { FireBaseAppointmentInfo } from './types';

@injectable()
export default class AppointmentRepository {
  constructor(private readonly _dbContext: DbService) { }

  async findById(id: string): Promise<Appointment | null> {
    const docRef = doc(this._dbContext.appointments, id);
    const docSnap: DocumentSnapshot<Appointment> = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data()) : null;
  }

  async findConflictingAppointments(
    createAppointmentDto: CreateAppointmentDto,
    appointmentStartingTime: Date,
    appointmentEndingTime: Date,
  ): Promise<Appointment[]> {
    const appointments: Appointment[] = [];

    // snapshot 1
    const conditionOne: QueryFieldFilterConstraint[] = [];
    conditionOne.push(where('doctorId', '==', createAppointmentDto.doctorId));
    conditionOne.push(where('appointmentDate', '==', new Date(createAppointmentDto.appointmentDate)));
    conditionOne.push(where('appointmentStartTime', '>=', appointmentStartingTime));
    conditionOne.push(where('appointmentStartTime', '<=', appointmentEndingTime));
    conditionOne.push(where('appointmentEndTime', '>=', appointmentStartingTime));
    conditionOne.push(where('appointmentEndTime', '<=', appointmentEndingTime));

    // snapshot 2
    const conditionTwo: QueryFieldFilterConstraint[] = [];
    conditionTwo.push(where('doctorId', '==', createAppointmentDto.doctorId));
    conditionTwo.push(where('appointmentDate', '==', new Date(createAppointmentDto.appointmentDate)));
    conditionTwo.push(where('appointmentStartTime', '<=', appointmentStartingTime));
    conditionTwo.push(where('appointmentEndTime', '>=', appointmentStartingTime));
    conditionTwo.push(where('appointmentStartTime', '<=', appointmentEndingTime));
    conditionTwo.push(where('appointmentEndTime', '<=', appointmentEndingTime));

    // snapshot 3
    const conditionThree: QueryFieldFilterConstraint[] = [];
    conditionThree.push(where('doctorId', '==', createAppointmentDto.doctorId));
    conditionThree.push(where('appointmentDate', '==', new Date(createAppointmentDto.appointmentDate)));
    conditionThree.push(where('appointmentStartTime', '>=', appointmentStartingTime));
    conditionThree.push(where('appointmentStartTime', '<=', appointmentEndingTime));
    conditionThree.push(where('appointmentEndTime', '>=', appointmentStartingTime));
    conditionThree.push(where('appointmentEndTime', '>=', appointmentEndingTime));

    // snapshot 4
    const conditionFour: QueryFieldFilterConstraint[] = [];
    conditionFour.push(where('doctorId', '==', createAppointmentDto.doctorId));
    conditionFour.push(where('appointmentDate', '==', new Date(createAppointmentDto.appointmentDate)));
    conditionFour.push(where('appointmentStartTime', '<=', appointmentStartingTime));
    conditionFour.push(where('appointmentStartTime', '<=', appointmentEndingTime));
    conditionFour.push(where('appointmentEndTime', '>=', appointmentStartingTime));
    conditionFour.push(where('appointmentEndTime', '>=', appointmentEndingTime));

    const firstSnapShot: Promise<QuerySnapshot<Appointment, DocumentData>> = getDocs(
      query(this._dbContext.appointments, ...conditionOne),
    );

    const SecondSnapShot: Promise<QuerySnapshot<Appointment, DocumentData>> = getDocs(
      query(this._dbContext.appointments, ...conditionTwo),
    );

    const thirdSnapShot: Promise<QuerySnapshot<Appointment, DocumentData>> = getDocs(
      query(this._dbContext.appointments, ...conditionThree),
    );

    const fourthSnapShot: Promise<QuerySnapshot<Appointment, DocumentData>> = getDocs(
      query(this._dbContext.appointments, ...conditionFour),
    );

    const [snapOne, snapTwo, snapThree, snapFour] = await Promise.all([
      firstSnapShot,
      SecondSnapShot,
      thirdSnapShot,
      fourthSnapShot,
    ]);

    snapOne.forEach((document: QueryDocumentSnapshot<Appointment, DocumentData>) => {
      appointments.push(document.data());
    });

    snapTwo.forEach((document: QueryDocumentSnapshot<Appointment, DocumentData>) => {
      appointments.push(document.data());
    });

    snapThree.forEach((document: QueryDocumentSnapshot<Appointment, DocumentData>) => {
      appointments.push(document.data());
    });

    snapFour.forEach((document: QueryDocumentSnapshot<Appointment, DocumentData>) => {
      appointments.push(document.data());
    });

    return appointments;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment | null> {
    const appointmentStartingTime = moment(`${createAppointmentDto.appointmentDate} ${createAppointmentDto.appointmentStartTime}`, 'YYYY-MM-DD HH:mm');
    const appointmentEndingTime = appointmentStartingTime.clone().add(createAppointmentDto.appointmentDuration, 'minutes');
    const appointmentData = {
      doctorId: createAppointmentDto.doctorId,
      patientName: createAppointmentDto.patientName,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
      appointmentStartTime: appointmentStartingTime.toDate(),
      appointmentEndTime: appointmentEndingTime.toDate(),
      appointmentDuration: createAppointmentDto.appointmentDuration,
      notes: createAppointmentDto.notes,
    };
    const documentRef = await addDoc(this._dbContext.appointments, appointmentData);
    const createdDocument = this.findById(documentRef.id);
    return createdDocument;
  }

  async findAll(
    filter: LooseObject = {},
  ): Promise<FireBaseAppointmentInfo[]> {
    const appointments: FireBaseAppointmentInfo[] = [];
    const conditions: QueryFieldFilterConstraint[] = [];
    if (filter?.appointmentStartDate && typeof filter?.appointmentStartDate === 'string') {
      conditions.push(where('appointmentDate', '>=', new Date(filter?.appointmentStartDate)));
    }
    if (filter?.appointmentEndDate && typeof filter?.appointmentEndDate === 'string') {
      conditions.push(where('appointmentDate', '<=', new Date(filter?.appointmentEndDate)));
    }
    const docSnap: QuerySnapshot<Appointment, DocumentData> = await getDocs(
      query(this._dbContext.appointments, ...conditions),
    );
    docSnap.forEach((document: QueryDocumentSnapshot<Appointment, DocumentData>) => {
      appointments.push({
        id: document.id,
        ...document.data()
      });
    });
    appointments.forEach((record: LooseObject) => {
      /* eslint-disable no-param-reassign */
      record.appointmentDate = moment.unix(<number>record.appointmentDate.seconds).format('YYYY-MM-DD');
      record.appointmentStartTime = moment.unix(<number>record.appointmentStartTime.seconds).format('YYYY-MM-DD HH:mm');
      record.appointmentEndTime = moment.unix(<number>record.appointmentEndTime.seconds).format('YYYY-MM-DD HH:mm');
    });
    return appointments;
  }
}
