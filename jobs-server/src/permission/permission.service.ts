import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(data: Partial<Permission>): Promise<Permission> {
    const newPermission = this.permissionRepository.create(data);
    return await this.permissionRepository.save(newPermission);
  }

  async findPermissionByName(name: string): Promise<Permission | null> {
    return await this.permissionRepository.findOneBy({ name });
  }
}
