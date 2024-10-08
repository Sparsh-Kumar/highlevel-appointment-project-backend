import { injectable } from 'inversify';
import {
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
  doc,
  getDoc,
  DocumentSnapshot,
  addDoc,
  QueryFieldFilterConstraint,
  deleteDoc,
} from 'firebase/firestore';
import { Doctor } from '../database/types';
import { LooseObject } from '../helpers/types';
import DbService from '../database/db.service';
import CreateDoctorDto from './dtos/create-doctor.dto';
import { FireBaseDoctorInfo } from './types';

@injectable()
export default class DoctorRepository {
  constructor(private readonly _dbContext: DbService) { }

  async findAll(
    filter: LooseObject = {},
  ): Promise<FireBaseDoctorInfo[]> {
    const doctors: FireBaseDoctorInfo[] = [];
    const conditions: QueryFieldFilterConstraint[] = [];
    if (filter?.name) {
      conditions.push(where('name', '==', filter?.name));
    }
    if (filter?.email) {
      conditions.push(where('email', '==', filter?.email));
    }
    const docSnap: QuerySnapshot<Doctor, DocumentData> = await getDocs(
      query(this._dbContext.doctors, ...conditions),
    );
    docSnap.forEach((document: QueryDocumentSnapshot<Doctor, DocumentData>) => {
      doctors.push({
        id: document.id,
        ...document.data(),
      });
    });
    return doctors;
  }

  async findById(id: string): Promise<Doctor | null> {
    const docRef = doc(this._dbContext.doctors, id);
    const docSnap: DocumentSnapshot<Doctor> = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data()) : null;
  }

  async findByIdAndRemove(id: string): Promise<void> {
    const docRef = doc(this._dbContext.doctors, id);
    await deleteDoc(docRef);
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor | null> {
    const doctorData = {
      name: createDoctorDto.name,
      email: createDoctorDto.email,
    };
    const documentRef = await addDoc(this._dbContext.doctors, doctorData);
    const createdDocument = this.findById(documentRef.id);
    return createdDocument;
  }
}
