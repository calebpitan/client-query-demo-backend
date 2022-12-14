import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The created user ID', example: 1 })
  id!: number;

  @Column()
  @ApiProperty({ description: 'The created user first name', example: 'Jack' })
  first_name!: string;

  @Column()
  @ApiProperty({ description: 'The created user last name', example: 'Ryan' })
  last_name!: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'The unique username for this user', example: 'jack.ryan' })
  username!: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'The created user email address', example: 'jackryan@example.com' })
  email!: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'The created timestamp', example: new Date() })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'The updated timestamp', example: new Date() })
  updatedAt!: Date;

  @DeleteDateColumn()
  @ApiProperty({
    description: 'The deleted timestamp',
    examples: [null, new Date()],
    nullable: true,
    required: false,
  })
  deletedAt?: Date;
}
