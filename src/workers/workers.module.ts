import { Module } from '@nestjs/common';
import { WorkersController } from './worker.controller';
import { WorkerService } from './worker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entity/worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Worker])],
  controllers: [WorkersController],
  providers: [WorkerService],
})
export class WorkersModule {}
