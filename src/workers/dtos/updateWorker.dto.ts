import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './createWorker.dto';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
  Length,
  Min,
  Max,
} from 'class-validator';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  position?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  salary?: number;

  @IsOptional()
  @IsString()
  department?: string;
}
