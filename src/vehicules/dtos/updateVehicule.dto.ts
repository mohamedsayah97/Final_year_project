import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculeDto } from './createVehicule.dto';

export class UpdateVehiculeDto extends PartialType(CreateVehiculeDto) {}
