import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsUUID,
  Min,
  Max,
  Matches,
  IsIn,
  IsEnum,
} from 'class-validator';

export class CreateVehiculeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, {
    message:
      "Le numéro d'immatriculation ne doit contenir que des lettres majuscules, chiffres et tirets",
  })
  registrationNumber!: string;

  @IsNotEmpty()
  @IsString()
  make!: string;

  @IsNotEmpty()
  @IsString()
  model!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['SUV', 'Berline', 'Break', 'Citadine', 'Utilitaire', 'Moto'], {
    message: 'Type de véhicule non valide',
  })
  vehicleType!: string;

  @IsNotEmpty()
  @IsString()
  color!: string;

  @IsNotEmpty()
  @IsDateString()
  purchaseDate!: Date;

  @IsOptional()
  @IsDateString()
  assignedDate?: Date;

  @IsOptional()
  @IsUUID()
  currentDriverId?: string;

  @IsOptional()
  @IsEnum(['available', 'in-use', 'maintenance', 'out-of-service'], {
    message:
      'Le statut doit être: available, in-use, maintenance ou out-of-service',
  })
  status?: string;
}
