import { Body, Controller, Post } from '@nestjs/common';
import { userService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

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
}
