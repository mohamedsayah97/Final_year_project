import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
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
  @IsPhoneNumber('TN')
  phoneNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  address?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  customerType?: string;
}
