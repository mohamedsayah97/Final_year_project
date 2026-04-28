import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { userService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { CreateUserByAdminDto } from './dtos/createUserByAdmin.dto';
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

  /**
   * Public endpoint - Register a new user (automatically gets ADMIN role)
   */
  @Post('register')
  async registerUser(@Body() body: RegisterDto) {
    return this.userService.registerUserService(body);
  }

  /**
   * Public endpoint - Login user
   */
  @Post('login')
  async loginUser(@Body() body: LoginDto) {
    return this.userService.loginUserService(body);
  }

  /**
   * Protected endpoint - Create a new user by admin (admin can specify role)
   */
  @Post('create-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async createUserByAdmin(
    @Body() body: CreateUserByAdminDto,
    @CurrentUser() currentUser: JWTPayloadType,
  ) {
    return this.userService.createUserByAdminService(body, currentUser);
  }

  /**
   * Protected endpoint - Get current user information
   */
  @Get('current-user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.userService.getCurrentUserService(payload.id);
  }

  /**
   * Protected endpoint - Get all users (admin only)
   */
  @Get('all')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getAllUsers() {
    return this.userService.getAll();
  }

  /**
   * Protected endpoint - Update current user information
   */
  @Put()
  @Roles(
    UserRole.ADMIN,
    UserRole.Financier,
    UserRole.RH,
    UserRole.park_manager,
    UserRole.stock_manager,
  )
  @UseGuards(AuthRolesGuard)
  async updateUser(
    @CurrentUser() Payload: JWTPayloadType,
    @Body() Body: UpdateUserDto,
  ) {
    return this.userService.updateUserService(Payload.id, Body);
  }

  /**
   * Protected endpoint - Delete a user by ID
   */
  @Delete(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.Financier,
    UserRole.RH,
    UserRole.park_manager,
    UserRole.stock_manager,
  )
  @UseGuards(AuthRolesGuard)
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() Payload: JWTPayloadType,
  ) {
    return this.userService.deleteService(id, Payload);
  }

  /**
   * Protected endpoint - Update user role (admin only)
   */
  @Put('update-role/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
    @CurrentUser() currentUser: JWTPayloadType,
  ) {
    return this.userService.updateUserRoleService(id, role, currentUser);
  }
}
