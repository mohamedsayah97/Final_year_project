import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { userService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProviders } from './providers/auth.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    //Here the JWT config
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          //jwt_secret_key and JWT_EXPIRE_IN from .env
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: { expiresIn: config.get<number>('JWT_EXPIRE_IN') },
        };
      },
    }),
  ],
  controllers: [UserController],
  providers: [userService, AuthProviders],
  exports: [userService],
})
export class UserModule {}
