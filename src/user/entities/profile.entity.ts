import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bytea', nullable: true })
  image: Buffer;

  @Column()
  mimeType: string;
}
