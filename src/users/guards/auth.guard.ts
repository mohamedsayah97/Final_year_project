import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    //déchiffrement du token
    if (token && type === 'Bearer') {
      try {
        const payload: JwtService = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
        });
        request['user'] = payload;
      } catch (error) {
        throw new UnauthorizedException('acces denied, invalid token');
      }
    } else {
      throw new UnauthorizedException('acces denied, no token provided');
    }
    return true;
  }
}
