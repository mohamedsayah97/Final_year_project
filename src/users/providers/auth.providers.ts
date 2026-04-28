import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { CreateUserByAdminDto } from '../dtos/createUserByAdmin.dto';
import { accesTokenType, JWTPayloadType } from 'src/utils/types';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/utils/enums';

@Injectable()
export class AuthProviders {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user (public endpoint)
   * The user will automatically get the ADMIN role by default
   * @param registerUserDto
   * @returns access token
   */
  async registerUserProvider(
    registerUserDto: RegisterDto,
  ): Promise<accesTokenType> {
    const { firstName, lastName, email, password, phoneNumber, address } =
      registerUserDto;

    const userFromDb = await this.userRepository.findOne({ where: { email } });
    if (userFromDb) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      // No role specified - will default to ADMIN from entity
    });

    const savedUser = await this.userRepository.save(newUser);

    const payload: JWTPayloadType = { id: savedUser.id, role: savedUser.role };
    const accesToken = await this.jwtService.signAsync(payload);
    return { accesToken };
  }

  /**
   * Logs in a user
   * @param login
   * @returns access token
   */
  async loginUserProvider(login: LoginDto): Promise<accesTokenType> {
    const { email, password } = login;
    const userFromDb = await this.userRepository.findOne({ where: { email } });
    if (!userFromDb) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, userFromDb.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JWTPayloadType = {
      id: userFromDb.id,
      role: userFromDb.role,
    };
    const accesToken = await this.jwtService.signAsync(payload);
    return { accesToken };
  }

  /**
   * Creates a new user by admin (protected endpoint)
   * Admin can specify the role for the new user
   * @param createUserDto
   * @param currentUserRole
   * @returns created user
   */
  async createUserByAdminProvider(
    createUserDto: CreateUserByAdminDto,
    currentUserRole: UserRole,
  ): Promise<User> {
    // Verify that only ADMIN can create users
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can create users');
    }

    const { firstName, lastName, email, password, phoneNumber, address, role } =
      createUserDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user with the specified role
    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      role, // Use the role provided by admin
    });

    return await this.userRepository.save(newUser);
  }
}
