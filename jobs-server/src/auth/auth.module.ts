import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/entities/user_role.entity';
import { RolePermission } from 'src/entities/role_permission.entity';
import { RolePermissionModule } from 'src/role_permission/role_permission.module';
import { UserRoleModule } from 'src/user_role/user_role.module';
import { RolePermissionService } from 'src/role_permission/role_permission.service';
import { UserRoleService } from 'src/user_role/user_role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserRole]),
    TypeOrmModule.forFeature([RolePermission]),
    UserModule,
    RolePermissionModule,
    UserRoleModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('MY_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    UserService,
    RolePermissionService,
    UserRoleService,
  ],
})
export class AuthModule {}
