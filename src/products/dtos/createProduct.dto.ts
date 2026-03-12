import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Length,
  MinLength,
  IsPositive,
  Min as MinNumber,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsPositive()
  @MinNumber(0.01)
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  @MinNumber(0)
  @IsPositive() // or remove @IsPositive if zero inventory is allowed
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  location!: string;
}
