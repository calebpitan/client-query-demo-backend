import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Exclude()
export class CreateUserDto {
  /**
   * The first name of the user to be created
   */
  @ApiProperty({ description: 'The first name of the user to be created', example: 'Jack' })
  @IsNotEmpty()
  @Expose()
  first_name!: string;

  /**
   * The last name of the user to be created
   */
  @ApiProperty({ description: 'The last name of the user to be created', example: 'Ryan' })
  @IsNotEmpty()
  @Expose()
  last_name!: string;

  /**
   * The username of the user to be created
   */
  @ApiProperty({ description: 'The username of the user to be created', example: 'jack.ryan' })
  @IsNotEmpty()
  @Expose()
  username!: string;

  /**
   * The email of the user to be created
   */
  @ApiProperty({
    description: 'The email of the user to be created',
    example: 'jackryan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email!: string;
}
