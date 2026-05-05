// register.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  Matches,
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
  @IsString()
  @Matches(/^(\+216)?[0-9]{8}$/, {
    message: 'Phone number must be 8 digits or +216 followed by 8 digits',
  })
  phoneNumber!: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  address!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
