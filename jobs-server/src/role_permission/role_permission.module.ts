import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionService } from './role_permission.service';
import { RolePermission } from '../entities/role_permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  providers: [RolePermissionService],
  controllers: [],
})
export class RolePermissionModule {}
