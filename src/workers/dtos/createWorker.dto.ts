import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  Length,
  Matches,
  IsIn,
} from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @Length(2, 50, {
    message: 'Le prénom doit contenir entre 2 et 50 caractères',
  })
  @Matches(/^[a-zA-ZÀ-ÿ\s-]+$/, {
    message: 'Le prénom ne doit contenir que des lettres, espaces et tirets',
  })
  firstName!: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @Length(2, 50, { message: 'Le nom doit contenir entre 2 et 50 caractères' })
  @Matches(/^[a-zA-ZÀ-ÿ\s-]+$/, {
    message: 'Le nom ne doit contenir que des lettres, espaces et tirets',
  })
  lastName!: string;

  @IsNotEmpty({ message: "L'email est obligatoire" })
  @IsEmail({}, { message: "Format d'email invalide" })
  @Length(5, 100, {
    message: "L'email doit contenir entre 5 et 100 caractères",
  })
  email!: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'Le numéro de téléphone contient des caractères invalides',
  })
  @Length(8, 20, {
    message: 'Le téléphone doit contenir entre 8 et 20 caractères',
  })
  phoneNumber?: string;

  @IsNotEmpty({ message: 'La ville est obligatoire' })
  @IsString({ message: 'La ville doit être une chaîne de caractères' })
  @Length(2, 100, {
    message: 'La ville doit contenir entre 2 et 100 caractères',
  })
  @Matches(/^[a-zA-ZÀ-ÿ\s-]+$/, {
    message: 'La ville ne doit contenir que des lettres, espaces et tirets',
  })
  city!: string;

  @IsNotEmpty({ message: 'Le poste est obligatoire' })
  @IsString({ message: 'Le poste doit être une chaîne de caractères' })
  @Length(2, 100, {
    message: 'Le poste doit contenir entre 2 et 100 caractères',
  })
  jobTitle!: string;

  @IsNotEmpty({ message: 'Le département est obligatoire' })
  @IsString({ message: 'Le département doit être une chaîne de caractères' })
  @Length(2, 100, {
    message: 'Le département doit contenir entre 2 et 100 caractères',
  })
  department!: string;

  @IsNotEmpty({ message: "La date d'embauche est obligatoire" })
  @IsDateString({}, { message: 'Format de date invalide' })
  hireDate!: Date;

  @IsNotEmpty({ message: 'Le type de contrat est obligatoire' })
  @IsString({
    message: 'Le type de contrat doit être une chaîne de caractères',
  })
  @IsIn(['CDI', 'CDD', 'Stage', 'Freelance', 'Intérim', 'Alternance'], {
    message:
      'Type de contrat non valide. Valeurs autorisées: CDI, CDD, Stage, Freelance, Intérim, Alternance',
  })
  contractType!: string;

  @IsNotEmpty({ message: 'Le salaire est obligatoire' })
  @IsNumber({}, { message: 'Le salaire doit être un nombre' })
  @Min(0, { message: 'Le salaire ne peut pas être négatif' })
  @Max(1000000, { message: 'Le salaire maximum est de 1 000 000' })
  salary!: number;

  @IsNotEmpty({
    message: "L'information sur la voiture de fonction est obligatoire",
  })
  @IsBoolean({ message: 'hasCompanyCar doit être un booléen' })
  hasCompanyCar!: boolean;
}
