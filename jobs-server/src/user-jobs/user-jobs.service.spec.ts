import { Test, TestingModule } from '@nestjs/testing';
import { UserJobsService } from './user-jobs.service';

describe('UserJobsService', () => {
  let service: UserJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserJobsService],
    }).compile();

    service = module.get<UserJobsService>(UserJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
