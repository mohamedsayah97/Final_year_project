import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './createSupplier.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
