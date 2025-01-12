import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user_role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async createUserRole(data: Partial<UserRole>): Promise<UserRole> {
    const newUserRole = this.userRoleRepository.create(data);
    return await this.userRoleRepository.save(newUserRole);
  }

  async findByUserIdAndRoleId(
    userId: string,
    roleId: string,
  ): Promise<UserRole | null> {
    return await this.userRoleRepository.findOneBy({
      userId: userId,
      roleId: roleId,
    });
  }

  async findByUserId(userId: string): Promise<UserRole[] | null> {
    return await this.userRoleRepository.find({
      where: { userId },
    });
  }
}
