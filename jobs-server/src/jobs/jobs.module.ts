import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserJobsModule } from 'src/user-jobs/user-jobs.module';
import { UserJobsService } from 'src/user-jobs/user-jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserJobs } from 'src/entities/user_jobs.entity';

@Module({
  imports: [
    FirebaseModule,
    UserJobsModule,
    TypeOrmModule.forFeature([UserJobs]),
  ],
  controllers: [JobsController],
  providers: [JobsService, UserJobsService],
})
export class JobsModule {}
