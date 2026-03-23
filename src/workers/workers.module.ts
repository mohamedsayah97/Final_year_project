import { Module } from '@nestjs/common';
import { WorkersController } from './worker.controller';
import { WorkerService } from './worker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entity/worker.entity';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Worker]), UserModule, JwtModule],
  controllers: [WorkersController],
  providers: [WorkerService],
})
export class WorkersModule {}
