import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { Role } from 'src/enum/user-role.enum';
import { AccountStatus } from './../../users/schema/user.schema';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEnum(Role)
  role?: Role;

  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;
}
