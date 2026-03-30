import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './createSupplier.dto';
import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  supplierName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(5, 255)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  registrationNumber?: string;
}
