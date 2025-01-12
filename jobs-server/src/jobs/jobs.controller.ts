import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobsService } from './jobs.service';
import { Job } from '../interface/jobs.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserJob } from 'src/interface/userJob.interface';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { PermissionsEnum } from 'src/consts/permissions';
import { FlatESLint } from 'eslint/use-at-your-own-risk';
import axios from 'axios';

@UseInterceptors(CacheInterceptor)
@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // GET /jobs --> []
  @Get()
  //@UseGuards(JwtAuthGuard)
  getJobs(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<Job[]> {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 200;
    return this.jobsService.getAllJobs(pageNumber, limitNumber);
  }

  @CacheKey('jobs_for_user')
  @CacheTTL(10 * 1000) // 10 seconds to live in cache
  @Get('for-user')
  @UseGuards(JwtAuthGuard)
  async getJobsForUser(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 200,
  ) {
    const userId = req.user.id;
    return await this.jobsService.getAllJobsByUserId(userId, page, limit);
  }

  // GET //jobs/:id --> {...}
  @Get(':id')
  getJobByID(@Param('id') id: string) {
    return this.jobsService.getJobByID(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createJob(
    @Body() newJobData: Job,
  ): Promise<{ success: boolean; message: string }> {
    console.log(
      '*********** Controller: Creating new job: *************',
      newJobData,
    );
    try {
      const result = await this.jobsService.createJob(newJobData);
      if (!result.success) {
        throw new HttpException(
          result.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.log('Controlller: Successfully added job');
        return { success: true, message: 'Successfully added job' };
      }
    } catch (erro) {
      console.log('Error accured creating job in controller');
      return { success: false, message: 'Error accured' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJob(@Param('id') id: string, @Request() req) {
    console.log(
      'Just entered the function , user permissions:',
      req.user,
      req.user.permissions,
    );
    console.log('Permission Enums:', PermissionsEnum.CanDeleteHisPosts);
    try {
      let isAllowed = false;
      if (
        req.user.permissions.some(
          (permissionId) =>
            String(permissionId) === PermissionsEnum.CanDeleteAllPosts,
        )
      ) {
        isAllowed = true;
      } else if (
        req.user.permissions.some(
          (permissionId) =>
            String(permissionId) === PermissionsEnum.CanDeleteHisPosts,
        ) &&
        String((await this.jobsService.getJobByID(id)).posterId) ===
          String(req.user.id)
      ) {
        isAllowed = true;
      }

      if (!isAllowed) {
        console.log('Something went wrong with permissions man');
        throw new HttpException(
          'Not allowed to delete this job',
          HttpStatus.FORBIDDEN,
        );
      }

      console.log('Will now attempt to delete job');
      const result = await this.jobsService.deleteJob(id);
      if (!result.success) {
        throw new HttpException(
          result.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.log('Controlller: Successfully deleted job');
        return { success: true, message: 'Successfully deleted job' };
      }
    } catch (erro) {
      console.log('Error accured deleting job in controller');
      return { success: false, message: 'Error accured in backend' };
    }
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async saveJobForUser(@Body() userJobData: UserJob, @Request() req) {
    try {
      console.log('Saving job: ', userJobData);
      console.log('request : ', req);
      const userId = req.user.id;
      await this.jobsService.saveJobForUser(
        userId,
        userJobData.jobId,
        userJobData.isChecked,
      );
      console.log('Controlller: Successfully saved/unsaved job for user');
      return {
        success: true,
        message: 'Successfully saved/unsaved job for user',
      };
    } catch (error) {
      console.log('Error accured saving job for user in controller');
      return { success: false, message: 'Error accured' };
    }
  }

  @Post('apply')
  async sendEmail(@Body() emailData: any) {
    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        emailData,
        {
          headers: {
            Authorization: `Bearer re_aMPiECdW_tdGXbUQAWHaBvrTcDsZMcCif`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
