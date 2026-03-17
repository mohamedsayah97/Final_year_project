import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { userService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { Roles } from './decorators/user-role.decorator';
import { UserRole } from 'src/utils/enums';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { UpdateUserDto } from './dtos/updateUser.dto';

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

  @Get('all')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  getAllUsers() {
    return this.userService.getAll();
  }

  @Put()
  @Roles(
    UserRole.ADMIN,
    UserRole.Financier,
    UserRole.RH,
    UserRole.park_manager,
    UserRole.stock_manager,
  )
  @UseGuards(AuthRolesGuard)
  updateUser(
    @CurrentUser() Payload: JWTPayloadType,
    @Body() Body: UpdateUserDto,
  ) {
    return this.userService.updateUserService(Payload.id, Body);
  }

  @Delete(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.Financier,
    UserRole.RH,
    UserRole.park_manager,
    UserRole.stock_manager,
  )
  @UseGuards(AuthRolesGuard)
  deleteUser(
    @Param('id', ParseIntPipe) id: string,
    @CurrentUser() Payload: JWTPayloadType,
  ) {
    return this.userService.deleteService(id, Payload);
  }
}
