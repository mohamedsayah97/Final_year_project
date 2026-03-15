import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { userService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: userService) {}

  @Post('register')
  registerUser(@Body() body: RegisterDto) {
    return this.userService.registerUserService(body);
  }

  @Post('login')
  loginUser(@Body() body: LoginDto) {
    return this.userService.loginUserService(body);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.userService.getCurrentUserService(payload.id);
  }
}
