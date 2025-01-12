import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions') // Matches your PostgreSQL table name
export class Permission {
  @PrimaryGeneratedColumn('uuid') // Automatically generates a UUID for the ID
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
