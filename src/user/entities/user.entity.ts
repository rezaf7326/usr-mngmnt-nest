import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  email: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @JoinColumn()
  @OneToOne(() => ProfileEntity, { cascade: true })
  profile: ProfileEntity;

  // @Column({ nullable: true })
  // bio: string;

  // @Column({ default: false })
  // verified: boolean;
}
