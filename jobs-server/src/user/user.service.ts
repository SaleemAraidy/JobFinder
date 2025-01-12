import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}
    
      async createUser(data: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
      }
    
      async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
      }
}
