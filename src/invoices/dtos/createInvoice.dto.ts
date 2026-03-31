import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  invoiceNumber!: string;

  @IsNotEmpty()
  @IsDate()
  date!: Date;

  @IsNotEmpty()
  @IsDate()
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
