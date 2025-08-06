import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { AccountStatus } from 'src/common/enum/account-status';
import { Role } from 'src/common/enum/user-role.enum';

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
