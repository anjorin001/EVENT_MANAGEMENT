import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Role } from 'src/enum/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mysecret',
    });
  }

  async validate(payload: {
    userId: string, email: string, role: Role}) { // payloadld cointain more than one unique user entity- id, email, rolr(rbac)
  return { userId: payload.userId, email: payload.email, role: payload.role };
  }
}
