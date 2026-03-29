import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { JWTPayloadType } from 'src/utils/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JWTPayloadType }>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    //déchiffrement du token
    if (token && type === 'Bearer') {
      try {
        const payload = (await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
        })) as unknown as JWTPayloadType;
        request.user = payload;
      } catch {
        throw new UnauthorizedException('acces denied, invalid token');
      }
    } else {
      throw new UnauthorizedException('acces denied, no token provided');
    }
    return true;
  }
}
