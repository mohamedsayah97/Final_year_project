import { Module } from '@nestjs/common';
import { VehiculeController } from './vehicule.controller';

@Module({
  imports: [],
  controllers: [VehiculeController],
  providers: [],
})
export class VehiculeModule {}
