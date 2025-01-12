import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_role') // Matches your PostgreSQL table name
export class UserRole {
  @PrimaryGeneratedColumn('uuid') // Automatically generates a UUID for the ID
  id: string;

  @Column({ name: 'userid', type: 'uuid' })
  userId: string;

  @Column({ name: 'roleid', type: 'uuid' })
  roleId: string;

  @Column({ name: 'isallowed', type: 'boolean', default: false })
  isAllowed: boolean;
}
