import { IsEmail, IsNotEmpty, IsOptional } from '@nestjs/class-validator';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional() // Rendre optionnel pour la mise à jour
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber('TN') // Spécifiez le pays
  phoneNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 100) // Length au lieu de Min/Max
  address?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  customerType?: string;
}
