import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import type { accesTokenType, JWTPayloadType } from 'src/utils/types';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserRole } from 'src/utils/enums';
import { AuthProviders } from './providers/auth.providers';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { CreateUserByAdminDto } from './dtos/createUserByAdmin.dto';

@Injectable()
export class userService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProviders: AuthProviders,
  ) {}

  /**
   * Register a new user (public) - automatically gets ADMIN role
   * @param registerDto
   * @returns access token
   */
  async registerUserService(registerDto: RegisterDto): Promise<accesTokenType> {
    return this.authProviders.registerUserProvider(registerDto);
  }

  /**
   * Login user
   * @param loginDto
   * @returns access token
   */
  async loginUserService(loginDto: LoginDto): Promise<accesTokenType> {
    return this.authProviders.loginUserProvider(loginDto);
  }

  /**
   * Create a new user by admin (protected)
   * @param createUserDto
   * @param currentUser
   * @returns created user
   */
  async createUserByAdminService(
    createUserDto: CreateUserByAdminDto,
    currentUser: JWTPayloadType,
  ): Promise<User> {
    // Verify that the current user is admin (double-check, though guard already does this)
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can create users');
    }

    return this.authProviders.createUserByAdminProvider(
      createUserDto,
      createUserDto.role,
    );
  }

  /**
   * Get current user by ID
   * @param id
   * @returns user
   */
  async getCurrentUserService(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Get all users
   * @returns array of users
   */
  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Update user information
   * @param id
   * @param updateUserDto
   * @returns updated user
   */
  async updateUserService(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, address } = updateUserDto;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (address) {
      user.address = address;
    }

    return this.userRepository.save(user);
  }

  /**
   * Delete a user
   * @param id
   * @param Payload
   * @returns success message
   */
  async deleteService(
    id: string,
    Payload: JWTPayloadType,
  ): Promise<{ message: string }> {
    const user = await this.getCurrentUserService(id);
    if (user.id === Payload?.id || Payload.role === UserRole.ADMIN) {
      await this.userRepository.remove(user);
      return { message: 'User has been deleted' };
    }
    throw new ForbiddenException('Access denied, you are not allowed');
  }

  /**
   * Update user role (only admin)
   * @param userId
   * @param newRole
   * @param currentUser
   * @returns updated user
   */
  async updateUserRoleService(
    userId: string,
    newRole: UserRole,
    currentUser: JWTPayloadType,
  ): Promise<User> {
    // Only admin can update roles
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can update user roles');
    }

    const user = await this.getCurrentUserService(userId);
    user.role = newRole;
    return this.userRepository.save(user);
  }
}
