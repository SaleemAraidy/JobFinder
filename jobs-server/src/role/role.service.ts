import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(data: Partial<Role>): Promise<Role> {
    const newRole = this.roleRepository.create(data);
    return await this.roleRepository.save(newRole);
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ name });
  }
}
