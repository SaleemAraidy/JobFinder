import { FirebaseService } from 'src/firebase/firebase.service';

export class CreateJobDto {
    skills: string[]; 
    placeType: string; 
    jobTitle: string; 
    contactNumber: string;
    link: string; 
    type: string; 
    jobPlace: string; 
    description: string;
}