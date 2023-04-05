import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('email', ['email'], { unique: true })
@Index('IDX_97672ac88f789774dd47f7c8be', ['email'], { unique: true })
@Entity('users', { schema: 'nest_auth' })
export class Users {
  @Column('varchar', { name: 'email', unique: true, length: 200 })
  email: string;

  @Column('varchar', { name: 'firstName', length: 200 })
  firstName: string;

  @Column('varchar', { name: 'lastName', nullable: true, length: 200 })
  lastName: string | null;

  @Column('varchar', { name: 'mobile', nullable: true, length: 20 })
  mobile: string | null;

  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'password', length: 300 })
  password: string;
}
