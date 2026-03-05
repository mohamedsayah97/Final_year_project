import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkerDto } from './dtos/createWorker.dto';
import { Worker } from './entity/worker.entity';
import { UpdateWorkerDto } from './dtos/updateWorker.dto';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}

  public async createWorkerService(dto: CreateWorkerDto) {
    const newWorker = this.workerRepository.create(dto);
    const savedWorker = await this.workerRepository.save(newWorker);
    return 'Worker created successfully';
  }

  public async getAllWorkersService() {
    return await this.workerRepository.find();
  }

  public async getWorkerByIdService(id: string) {
    const worker = await this.workerRepository.findOneBy({ id });
    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }
    return worker;
  }

  public async updateWorkerService(id: string, dto: UpdateWorkerDto) {
    const worker = await this.getWorkerByIdService(id);
    Object.assign(worker, dto);
    await this.workerRepository.save(worker);
    return 'Worker updated successfully';
  }

  public async deleteWorkerService(id: string) {
    const worker = await this.getWorkerByIdService(id);
    await this.workerRepository.remove(worker);
    return 'Worker deleted successfully';
  }
}
