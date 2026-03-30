import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './createProduct.dto';
import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  MinLength,
  IsPositive,
  Min,
} from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsString()
  @Length(5, 120)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  @MinLength(5)
  location?: string;
}
