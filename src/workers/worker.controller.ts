import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dtos/createWorker.dto';
import { UpdateWorkerDto } from './dtos/updateWorker.dto';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserRole } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('create')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.RH) //vérifier les roles
  createWorker(
    @Body(ValidationPipe) createWorkerDto: CreateWorkerDto,
    @CurrentUser() Payload: JWTPayloadType,
  ) {
    return this.workerService.createWorkerService(createWorkerDto, Payload.id);
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
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.RH) //vérifier les roles
  updateWorker(
    @Param('id') id: string,
    @Body(ValidationPipe) updateWorkerDto: UpdateWorkerDto,
  ) {
    return this.workerService.updateWorkerService(id, updateWorkerDto);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard) //déchiffrement du token,il faut importer jwtmodule dans service module
  @Roles(UserRole.ADMIN, UserRole.RH) //vérifier les roles
  deleteWorker(@Param('id') id: string) {
    return this.workerService.deleteWorkerService(id);
  }
}
