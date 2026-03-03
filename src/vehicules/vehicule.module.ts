import { Module } from '@nestjs/common';
import { VehiculeController } from './vehicule.controller';
import { Vehicule } from './entity/vehicule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeService } from './vehicule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicule])],
  controllers: [VehiculeController],
  providers: [VehiculeService],
})
export class VehiculeModule {}
