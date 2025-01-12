import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Matches your PostgreSQL table name
export class User {
  @PrimaryGeneratedColumn('uuid') // Automatically generates a UUID for the ID
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  given_name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  family_name: string;

  @Column({ name: 'photo', type: 'text', nullable: true })
  picture: string; 

  @Column({name: 'email', type: 'varchar', length: 255, unique: true })
  email: string; 
}