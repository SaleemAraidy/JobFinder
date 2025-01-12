import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_jobs') // Matches your PostgreSQL table name
export class UserJobs {
  @PrimaryGeneratedColumn('uuid') // Automatically generates a UUID for the ID
  id: string;

  @Column({ name: 'userid', type: 'integer' })
  userId: number;

  @Column({ name: 'jobid', type: 'varchar', length: 255 })
  jobId: string;

  @Column({ name: 'ischecked', type: 'boolean', nullable: true })
  isChecked: boolean;
}
