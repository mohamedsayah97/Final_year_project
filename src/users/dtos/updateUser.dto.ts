import { IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Min(6)
  @IsOptional()
  password!: string;
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @IsOptional()
  address!: string;
}
