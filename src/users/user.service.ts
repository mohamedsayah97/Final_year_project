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

@Injectable()
export class userService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProviders: AuthProviders,
  ) {}

  async registerUserService(registerDto: RegisterDto) {
    return this.authProviders.registerUserProvider(registerDto);
  }

  async loginUserService(loginDto: LoginDto): Promise<accesTokenType> {
    return this.authProviders.loginUserProvider(loginDto);
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
