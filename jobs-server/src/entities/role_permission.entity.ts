import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role_permission') // Matches your PostgreSQL table name
export class RolePermission {
  @PrimaryGeneratedColumn('uuid') // Automatically generates a UUID for the ID
  id: string;

  @Column({ name: 'roleid', type: 'uuid' })
  roleId: string;

  @Column({ name: 'permissionid', type: 'uuid' })
  permissionId: string;

  @Column({ name: 'isallowed', type: 'boolean', default: false })
  isAllowed: boolean;
}
