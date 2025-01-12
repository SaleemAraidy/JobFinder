import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserJobs } from 'src/entities/user_jobs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserJobsService {
  constructor(
    @InjectRepository(UserJobs)
    private readonly userJobsRepository: Repository<UserJobs>,
  ) {}

  async createSavedJob(data: Partial<UserJobs>): Promise<UserJobs> {
    try {
      const existingJobId = await this.findJob(data);
      if (existingJobId) {
        data.id = existingJobId;
      }
      const savedJob = await this.userJobsRepository.create(data);
      return await this.userJobsRepository.save(savedJob);
    } catch (err) {
      console.error('Error creating saved job in user-job service:', err);
      throw err;
    }
  }

  async findJob(data: Partial<UserJobs>): Promise<string> {
    const savedjob = await this.userJobsRepository.findOneBy({
      userId: data.userId,
      jobId: data.jobId,
    });
    return savedjob ? savedjob.id : null;
  }

  async getSavedJobsByUserId(userId: number): Promise<string[]> {
    const savedJobs = await this.userJobsRepository.find({
      where: {
        userId,
        isChecked: true,
      },
    });
    return savedJobs?.map((job) => job.jobId);
  }
}
