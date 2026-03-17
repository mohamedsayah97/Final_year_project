import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { accesTokenType } from 'src/utils/types';
import type { JWTPayloadType } from 'src/utils/types';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserRole } from 'src/utils/enums';

@Injectable()
export class userService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
/**
 * Registers a new user
 * @param registerUserDto
 * @returns
 */
  async registerUserService(
    registerUserDto: RegisterDto,
  ): Promise<accesTokenType> {
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
    const payload: JWTPayloadType = { id: savedUser.id, role: savedUser.role };
    const accesToken = await this.jwtService.signAsync(payload);
    return { accesToken };
  }

  /**
   * Logs in a user
   * @param login
   * @returns
   */
  async loginUserService(login: LoginDto): Promise<accesTokenType> {
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
    const payload: JWTPayloadType = {
      id: userFromDb.id,
      role: userFromDb.role,
    };
    const accesToken = await this.jwtService.signAsync(payload);
    return { accesToken };
  }
  //we used guard here
  async getCurrentUserService(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUserService(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    const { password, address } = updateUserDto;

    // Mise à jour du mot de passe si fourni
    if (password) {
      const salt = await bcrypt.genSalt(10);
      // hashage du password avant le sauvegarder dans la BD
      user.password = await bcrypt.hash(password, salt);
    }

    // Mise à jour de l'adresse si fournie
    if (address) {
      user.address = address;
    }

    // Sauvegarder et retourner l'utilisateur mis à jour
    return this.userRepository.save(user);
  }

  async deleteService(id: string, Payload: JWTPayloadType) {
    const user = await this.getCurrentUserService(id);
    //ici sauf l'utilisateur et l'admin qui peuvent supprimer le compte
    if (user.id === Payload?.id || Payload.role === UserRole.ADMIN) {
      await this.userRepository.remove(user);
      return { message: 'User has been deleted' };
    }
    throw new ForbiddenException('acces denied, you are not allowed');
  }
}
