import { Repository } from 'typeorm';
import { Vehicule } from './entity/vehicule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehiculeDto } from './dtos/createVehicule.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateVehiculeDto } from './dtos/updateVehicule.dto';

export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
  ) {}

  public async createVehiculeService(dto: CreateVehiculeDto) {
    const newVehicule = this.vehiculeRepository.create(dto);
    return await this.vehiculeRepository.save(newVehicule);
  }

  public async getAllVehiculesService() {
    return await this.vehiculeRepository.find();
  }

  public async getVehiculeByIdService(id: string) {
    const vehicule = await this.vehiculeRepository.findOneBy({ id });
    if (!vehicule) {
      throw new NotFoundException(`Vehicule with ID ${id} not found`);
    }
    return vehicule;
  }

  public async updateVehiculeService(id: string, dto: UpdateVehiculeDto) {
    const vehicule = await this.getVehiculeByIdService(id);
    Object.assign(vehicule, dto);
    return await this.vehiculeRepository.save(vehicule);
  }

  public async deleteVehiculeService(id: string) {
    const vehicule = await this.getVehiculeByIdService(id);
    await this.vehiculeRepository.remove(vehicule);
    return { message: `Vehicule with ID ${id} has been deleted` };
  }
}
