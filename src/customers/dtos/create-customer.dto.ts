import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsPhoneNumber('TN') // Spécifiez le pays (TN pour Tunisie)
  phoneNumber!: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100) // Utilisez Length pour les strings (min 5, max 100)
  address!: string;

  @IsNotEmpty()
  @IsString()
  customerType!: string;
}
