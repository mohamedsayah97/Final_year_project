import { Test } from '@nestjs/testing';
import { WorkersController } from '../../worker.controller';
import { WorkerService } from '../../worker.service';
import { CreateWorkerDto } from '../../dtos/createWorker.dto';
import { UpdateWorkerDto } from '../../dtos/updateWorker.dto';
import type { JWTPayloadType } from 'src/utils/types';
import { UserRole } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';

const mockWorkerService = {
  createWorkerService: jest.fn(),
  getAllWorkersService: jest.fn(),
  getWorkerByIdService: jest.fn(),
  updateWorkerService: jest.fn(),
  deleteWorkerService: jest.fn(),
};

describe('WorkersController', () => {
  let workersController: WorkersController;
  let workerService: WorkerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [
        {
          provide: WorkerService,
          useValue: mockWorkerService,
        },
      ],
    })
      .overrideGuard(AuthRolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    workersController = moduleRef.get<WorkersController>(WorkersController);
    workerService = moduleRef.get<WorkerService>(WorkerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(workersController).toBeDefined();
    expect(workerService).toBeDefined();
  });

  describe('createWorker', () => {
    it('should create a worker', async () => {
      const dto: CreateWorkerDto = {
        firstName: 'Test',
        lastName: 'Worker',
        email: 'worker@example.com',
        phoneNumber: '+21612345678',
        city: 'Tunis',
        jobTitle: 'Developer',
        department: 'IT',
        hireDate: new Date(),
        contractType: 'CDI',
        salary: 3000,
        hasCompanyCar: false,
      };
      const payload: JWTPayloadType = { id: 'user-id', role: UserRole.ADMIN };
      const expected = 'Worker created successfully';

      mockWorkerService.createWorkerService.mockResolvedValue(expected);

      const result = await workersController.createWorker(dto, payload);

      expect(result).toEqual(expected);
      expect(mockWorkerService.createWorkerService).toHaveBeenCalledWith(
        dto,
        payload.id,
      );
    });
  });

  describe('getAllWorkers', () => {
    it('should return workers array', async () => {
      const expected = [{ id: '1', firstName: 'Test' }];
      mockWorkerService.getAllWorkersService.mockResolvedValue(expected);

      const result = await workersController.getAllWorkers();

      expect(result).toEqual(expected);
      expect(mockWorkerService.getAllWorkersService).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWorkerById', () => {
    it('should return worker by id', async () => {
      const expected = { id: '1', firstName: 'Test' };
      mockWorkerService.getWorkerByIdService.mockResolvedValue(expected);

      const result = await workersController.getWorkerById('1');

      expect(result).toEqual(expected);
      expect(mockWorkerService.getWorkerByIdService).toHaveBeenCalledWith('1');
    });
  });

  describe('updateWorker', () => {
    it('should update worker successfully', async () => {
      const dto: UpdateWorkerDto = {
        firstName: 'Test',
        lastName: 'Worker',
        email: 'worker@example.com',
        phoneNumber: '+21612345678',
        city: 'Tunis',
        jobTitle: 'Manager',
        department: 'HR',
        hireDate: new Date(),
        contractType: 'CDI',
        salary: 4000,
        hasCompanyCar: true,
      };
      const expected = 'Worker updated successfully';
      mockWorkerService.updateWorkerService.mockResolvedValue(expected);

      const result = await workersController.updateWorker('1', dto);

      expect(result).toEqual(expected);
      expect(mockWorkerService.updateWorkerService).toHaveBeenCalledWith(
        '1',
        dto,
      );
    });
  });

  describe('deleteWorker', () => {
    it('should delete worker successfully', async () => {
      const expected = 'Worker deleted successfully';
      mockWorkerService.deleteWorkerService.mockResolvedValue(expected);

      const result = await workersController.deleteWorker('1');

      expect(result).toEqual(expected);
      expect(mockWorkerService.deleteWorkerService).toHaveBeenCalledWith('1');
    });
  });
});
