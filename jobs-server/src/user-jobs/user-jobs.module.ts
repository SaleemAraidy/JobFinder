import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserJobs } from 'src/entities/user_jobs.entity';
import { UserJobsService } from './user-jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserJobs])],
  providers: [UserJobsService],
})
export class UserJobsModule {}
