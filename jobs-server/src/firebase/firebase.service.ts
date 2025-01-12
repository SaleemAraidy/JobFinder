import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseService {
    private readonly db: FirebaseFirestore.Firestore;
    private readonly collection: FirebaseFirestore.CollectionReference;
  
    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
      this.db = firebaseApp.firestore();
      this.collection = this.db.collection('<collection_name>');
    }

    getFireStoreInstance() : FirebaseFirestore.Firestore {
        return this.db;
    }
  }
