// dtos/create-user-by-admin.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { UserRole } from 'src/utils/enums';

export class CreateUserByAdminDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Min(6)
  password!: string;

  @IsNotEmpty()
  @IsPhoneNumber('TN')
  phoneNumber!: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  address!: string;

  @IsNotEmpty() // Ici le rôle est obligatoire
  @IsEnum(UserRole)
  role!: UserRole; // L'admin choisit le rôle
}
