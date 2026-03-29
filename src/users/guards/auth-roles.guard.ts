import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/utils/enums';
import type { JWTPayloadType } from 'src/utils/types';
import { userService } from '../user.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: userService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles: UserRole[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return false;

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
        const user = await this.userService.getCurrentUserService(payload.id);
        if (!user) return false;

        // Compare roles case-insensitively to avoid failures due to casing differences
        const userRole = String(user.role).toLowerCase();
        const allowedRoles = roles.map((role) => String(role).toLowerCase());

        if (allowedRoles.includes(userRole)) {
          request.user = payload;
          return true;
        }
      } catch {
        throw new UnauthorizedException('acces denied, invalid token');
      }
    } else {
      throw new UnauthorizedException('acces denied, no token provided');
    }
    return false;
  }
}
