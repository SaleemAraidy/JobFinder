import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from '../jobs/jobs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { UserJobs } from 'src/entities/user_jobs.entity';
import { UserJobsModule } from 'src/user-jobs/user-jobs.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UserRoleModule } from 'src/user_role/user_role.module';
import { RolePermissionModule } from 'src/role_permission/role_permission.module';
import { RoleModule } from 'src/role/role.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RolePermission } from 'src/entities/role_permission.entity';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/user_role.entity';
import { Permission } from 'src/entities/permission.entity';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 30 * 1000,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    AuthModule,
    UserJobsModule,
    UserModule,
    UserRoleModule,
    RolePermissionModule,
    RoleModule,
    PermissionModule,
    JobsModule,
    ConfigModule.forRoot({ cache: true }),
    FirebaseModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log(
          '***************************',
          configService.get('PGADMIN_USERNAME'),
        ); // Log values to check
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: configService.get<string>('PGADMIN_USERNAME'),
          password: configService.get<string>('PGADMIN_PASSWORD'),
          database: configService.get<string>('PGADMIN_DATABASE'),
          entities: [
            User,
            UserJobs,
            RolePermission,
            Role,
            UserRole,
            Permission,
          ],
          autoLoadEntities: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserJobs]),
    TypeOrmModule.forFeature([RolePermission]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([UserRole]),
    TypeOrmModule.forFeature([Permission]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
