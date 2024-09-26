import { injectable } from 'inversify';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  CollectionReference, Firestore, getFirestore, collection,
} from 'firebase/firestore';
import { Appointment, Doctor } from './types';

@injectable()
export default class DbService {
  private _fireStore: Firestore;

  private readonly _firebaseConfig: FirebaseOptions = {};

  constructor() {
    this._firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };
  }

  public initializeApplication(): void {
    const firebaseApp = initializeApp(this._firebaseConfig);
    this._fireStore = getFirestore(firebaseApp);
  }

  public getCollection<T>(collectionName: string): CollectionReference<T> {
    return collection(this._fireStore, collectionName) as CollectionReference<T>;
  }

  get doctors(): CollectionReference<Doctor> {
    return this.getCollection<Doctor>('doctors');
  }

  get appointments(): CollectionReference<Appointment> {
    return this.getCollection<Appointment>('appointments');
  }
}
