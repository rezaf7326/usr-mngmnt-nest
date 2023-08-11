import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsString()
  @Length(8, 128)
  readonly password: string;

  @IsString()
  @IsEmail()
  readonly email: string;
}
