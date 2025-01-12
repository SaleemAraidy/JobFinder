import { Inject, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Job } from '../interface/jobs.interface';
import { CreateJobDto } from './dto/create-job.dto';
import * as admin from 'firebase-admin';
import { UserJobs } from 'src/entities/user_jobs.entity';
import { UserJobsService } from 'src/user-jobs/user-jobs.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JobsService {
  private _db;
  private _jobsCollection;
  constructor(
    private firebaseService: FirebaseService,
    private userJobsService: UserJobsService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {
    this._db = firebaseService.getFireStoreInstance();
    this._jobsCollection = this._db.collection('jobs');
  }

  async getUserSavedJobs(userId: number): Promise<string[]> {
    return await this.userJobsService.getSavedJobsByUserId(userId);
  }

  async saveJobForUser(userId: number, jobId: string, isChecked: boolean) {
    try {
      console.log('Saving job for user: ', userId, jobId, isChecked);
      const userJobsData: Partial<UserJobs> = {
        userId,
        jobId,
        isChecked,
      };
      await this.userJobsService.createSavedJob(userJobsData);
      await this.cacheManager.del('jobs_for_user');
    } catch (error: any) {
      console.log('Error saving job in job service: ', error);
      throw new Error(error);
    }
  }

  //Returns all jobs from db.
  async getAllJobs(page: number, limit: number): Promise<Job[]> {
    const offset = (page - 1) * limit;
    try {
      const snapshot = await this._jobsCollection
        .orderBy('posted', 'asc') // Order by the `posted` timestamp
        .offset(offset) // Skip documents
        .limit(limit) // Fetch only the required number
        .get();

      const jobs: Job[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Job),
      }));

      console.log('Jobs fetched:', jobs);
      return jobs;
    } catch (error) {
      console.error('Error fetching paginated jobs:', error);
      throw new Error('Could not fetch paginated jobs.');
    }
  }

  async getAllJobsByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Job[]> {
    page = parseInt(page as unknown as string, 10);
    limit = parseInt(limit as unknown as string, 10);

    if (isNaN(page) || page < 1) {
      throw new Error('Page must be a positive integer and >= 1.');
    }
    if (isNaN(limit) || limit < 1) {
      throw new Error('Limit must be a positive integer.');
    }

    const snapshot = await this._jobsCollection
      .orderBy('posted', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)
      .get();
    const savedJobs: string[] = await this.getUserSavedJobs(userId);
    const jobs: Job[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      isChecked: savedJobs.includes(doc.id),
      ...(doc.data() as Job),
    }));

    return jobs;
  }

  //Returns specefic job by id.
  async getJobByID(id: string): Promise<Job> {
    const doc = await this._jobsCollection.doc(id).get();
    console.log('Doc:', doc);
    console.log('Doc data:', doc.data());
    if (!doc.exists) {
      console.log('Found no matching jobs');
      return null;
    }
    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  //Creates a new job based on job details recieved from client.
  async createJob(newJob: Job): Promise<{ success: boolean; message: string }> {
    try {
      console.log('job: ', newJob);
      const res = await this._jobsCollection.add({
        ...newJob,
        posted: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.error('Service: Successfully added job');
      return { success: true, message: 'Added job successfully' };
    } catch (error) {
      console.error('Error accured:', error);
      return { success: false, message: 'Error accured' };
    }
  }

  //Deletes specefic job by id
  async deleteJob(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await this._jobsCollection.doc(id).delete();
      console.error('Service: Successfully deleted job');
      return { success: true, message: 'deleted job successfully' };
    } catch (error) {
      console.error('Error accured deleting job in service:', error);
      return {
        success: false,
        message: 'Error accured in service, job not deleted.',
      };
    }
  }
}
