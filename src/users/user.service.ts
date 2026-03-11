import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class userService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
/**
 * Registers a new user
 * @param registerUserDto 
 * @returns 
 */
  async registerUserService(registerUserDto: RegisterDto) {
    const { firstName, lastName, email, password, phoneNumber, address, role } =
      registerUserDto;
    const userFromDb = await this.userRepository.findOne({ where: { email } });
    if (userFromDb) {
      throw new Error('Email already exists');
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
      role,
    });
    const savedUser = await this.userRepository.save(newUser);
    // todo generate token
    return savedUser;
  }

  /**
   * Logs in a user
   * @param login 
   * @returns 
   */
  async loginUserService(login: LoginDto) {
    const { email, password } = login;
    const userFromDb = await this.userRepository.findOne({ where: { email } });
    if (!userFromDb) {
      throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, userFromDb.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    // todo generate token
    return userFromDb;
  }
}
