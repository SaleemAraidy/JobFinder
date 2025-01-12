import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../entities/role_permission.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async createRolePermission(
    data: Partial<RolePermission>,
  ): Promise<RolePermission> {
    const newRolePermission = this.rolePermissionRepository.create(data);
    return await this.rolePermissionRepository.save(newRolePermission);
  }

  async findByRoleIdAndPermissionId(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission | null> {
    return await this.rolePermissionRepository.findOneBy({
      roleId: roleId,
      permissionId: permissionId,
    });
  }
  async findAllowedByRoleId(roleId: string): Promise<RolePermission[] | null> {
    return await this.rolePermissionRepository.find({
      where: {
        roleId: roleId,
        isAllowed: true,
      },
    });
  }
}
