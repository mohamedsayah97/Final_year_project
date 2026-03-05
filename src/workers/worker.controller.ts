import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dtos/createWorker.dto';
import { UpdateWorkerDto } from './dtos/updateWorker.dto';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('create')
  createWorker(@Body(ValidationPipe) createWorkerDto: CreateWorkerDto) {
    return this.workerService.createWorkerService(createWorkerDto);
  }

  @Get('all')
  getAllWorkers() {
    return this.workerService.getAllWorkersService();
  }

  @Get(':id')
  getWorkerById(@Param('id') id: string) {
    return this.workerService.getWorkerByIdService(id);
  }

  @Put(':id')
  updateWorker(
    @Param('id') id: string,
    @Body(ValidationPipe) updateWorkerDto: UpdateWorkerDto,
  ) {
    return this.workerService.updateWorkerService(id, updateWorkerDto);
  }

  @Delete(':id')
  deleteWorker(@Param('id') id: string) {
    return this.workerService.deleteWorkerService(id);
  }
}
