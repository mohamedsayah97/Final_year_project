import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  invoiceNumber!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: Date;

  @IsNotEmpty()
  @IsDateString()
  dueDate!: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalAmount!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  taxAmount!: number;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsString()
  paymentTerms!: string;
}
