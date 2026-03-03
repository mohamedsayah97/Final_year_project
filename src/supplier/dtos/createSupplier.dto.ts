import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom du fournisseur est obligatoire' })
  supplier_name!: string;

  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty({ message: "Le numéro d'enregistrement est requis" })
  registration_number!: string;
}
