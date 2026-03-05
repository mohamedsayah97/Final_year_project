import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dtos/createVehicule.dto';
import { UpdateVehiculeDto } from './dtos/updateVehicule.dto';

@Controller('vehicules')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  @Post('create')
  createVehicule(@Body(ValidationPipe) createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.createVehiculeService(createVehiculeDto);
  }

  @Get('all')
  getAllVehicules() {
    return this.vehiculeService.getAllVehiculesService();
  }

  @Get(':id')
  getVehiculeById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.vehiculeService.getVehiculeByIdService(id);
  }

  @Put(':id')
  updateVehicule(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateVehiculeDto: UpdateVehiculeDto,
  ) {
    return this.vehiculeService.updateVehiculeService(id, updateVehiculeDto);
  }

  @Delete(':id')
  deleteVehicule(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.vehiculeService.deleteVehiculeService(id);
  }
}
