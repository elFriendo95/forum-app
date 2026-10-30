import { IsString, MinLength, IsEmail } from 'class-validator';
export class LoginDto {
  @IsString()
  @MinLength(1)
  password: string;
  @IsEmail()
  email: string;
}
