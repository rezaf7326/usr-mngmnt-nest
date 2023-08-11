import { IsEmail, IsNumber, IsString } from 'class-validator';

export class AuthenticatedDto {
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
