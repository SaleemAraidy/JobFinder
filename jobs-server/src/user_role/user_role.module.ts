import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleService } from './user_role.service';
import { UserRole } from '../entities/user_role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  providers: [UserRoleService],
  controllers: [],
})
export class UserRoleModule {}
