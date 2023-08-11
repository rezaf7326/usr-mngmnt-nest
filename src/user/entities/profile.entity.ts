import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  // @Column({ nullable: true })
  // bio: string;

  // @Column({ default: false })
  // verified: boolean;
}
