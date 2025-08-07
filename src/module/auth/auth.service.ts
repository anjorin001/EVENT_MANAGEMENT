import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './../users/user.service';

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountStatus } from 'src/common/enum/account-status';
import { Role } from 'src/common/enum/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const user = await this.userService.findByEmail(data.email);
    if (user) throw new ConflictException('user already exist');

    if (data.role === Role.ADMIN)
      throw new ForbiddenException('users cannot signup as admin');

    const status =
      data.role === Role.PROMOTER
        ? AccountStatus.PENDING
        : AccountStatus.APPROVED;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const savedUser = this.userService.create({
      ...data,
      accountStatus: status,
      password: hashedPassword,
    });

    return {
      message: 'signup successfull',
      data: savedUser,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    if (user.accountStatus !== AccountStatus.APPROVED)
      throw new ForbiddenException('account is not approved'); //TODO

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'login successfull',
      data: {
        token: this.jwtService.sign(payload),
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    return this.userService.findById(userId);
  }
}
