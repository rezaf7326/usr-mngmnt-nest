import { IsEmail, IsNumber, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
