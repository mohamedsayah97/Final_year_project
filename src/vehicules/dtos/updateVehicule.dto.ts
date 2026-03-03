import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsUUID,
  Min,
  Max,
  Matches,
  IsIn,
  IsEnum,
} from 'class-validator';

export class UpdateVehiculeDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, {
    message:
      "Le numéro d'immatriculation ne doit contenir que des lettres majuscules, chiffres et tirets",
  })
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @IsOptional()
  @IsString()
  @IsIn(['SUV', 'Berline', 'Break', 'Citadine', 'Utilitaire', 'Moto'], {
    message: 'Type de véhicule non valide',
  })
  vehicleType?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: Date;

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
