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

export class RegisterDto {
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
  @IsPhoneNumber('TN') // Spécifiez le pays (TN pour Tunisie)
  phoneNumber!: string;
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  address!: string;
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;
}
