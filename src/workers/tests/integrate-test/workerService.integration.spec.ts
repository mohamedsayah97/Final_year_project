import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkerService } from '../../worker.service';
import { Worker } from '../../entity/worker.entity';
import { CreateWorkerDto } from '../../dtos/createWorker.dto';
import { UpdateWorkerDto } from '../../dtos/updateWorker.dto';
import { userService } from 'src/users/user.service';
import { Repository } from 'typeorm';

type MockRepository = Partial<Repository<Worker>> & {
  create: jest.MockedFunction<
    (dto: CreateWorkerDto & Partial<Worker>) => Worker
  >;
  save: jest.MockedFunction<(worker: Worker) => Promise<Worker>>;
  find: jest.MockedFunction<() => Promise<Worker[]>>;
  findOneBy: jest.MockedFunction<
    (criteria: Partial<Worker>) => Promise<Worker | null>
  >;
  remove: jest.MockedFunction<(worker: Worker) => Promise<Worker>>;
};

describe('WorkerService Integration Tests', () => {
  let workerService: WorkerService;
  let workerRepository: Repository<Worker>;
  let workersData: Worker[] = [];

  const mockRepository: MockRepository = {
    create: jest.fn(
      (dto: CreateWorkerDto) =>
        ({
          ...dto,
          id: 'worker-1',
        }) as Worker,
    ),
    save: jest.fn((worker: Worker) => {
      const index = workersData.findIndex((item) => item.id === worker.id);
      if (index >= 0) workersData[index] = worker;
      else workersData.push(worker);
      return worker;
    }),
    find: jest.fn(() => workersData),
    findOneBy: jest.fn(
      (criteria: Partial<Worker>) =>
        workersData.find((item) => item.id === criteria.id) || null,
    ),
    remove: jest.fn((worker: Worker) => {
      workersData = workersData.filter((item) => item.id !== worker.id);
      return worker;
    }),
  };

  const mockUserService = {
    getCurrentUserService: jest.fn((userId: string) => ({
      id: userId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'admin',
    })),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: getRepositoryToken(Worker),
          useValue: mockRepository,
        },
        {
          provide: userService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    workerService = module.get<WorkerService>(WorkerService);
    workerRepository = module.get<Repository<Worker>>(
      getRepositoryToken(Worker),
    );
  });

  afterEach(() => {
    workersData = [];
    jest.clearAllMocks();
  });

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

    const result = await workerService.createWorkerService(dto, 'user-id');

    expect(result).toBe('Worker created successfully');
    const saved = await workerRepository.findOneBy({ id: 'worker-1' });
    expect(saved).toBeDefined();
  });

  it('should return all workers', async () => {
    await workerService.createWorkerService(
      {
        firstName: 'Test2',
        lastName: 'Worker2',
        email: 'worker2@example.com',
        phoneNumber: '+21687654321',
        city: 'Sousse',
        jobTitle: 'Manager',
        department: 'HR',
        hireDate: new Date(),
        contractType: 'CDD',
        salary: 2500,
        hasCompanyCar: true,
      },
      'user-id',
    );

    const result = await workerService.getAllWorkersService();

    expect(result).toHaveLength(1);
  });

  it('should return worker by id', async () => {
    await workerService.createWorkerService(
      {
        firstName: 'Test3',
        lastName: 'Worker3',
        email: 'worker3@example.com',
        phoneNumber: '+21611112222',
        city: 'Sfax',
        jobTitle: 'Support',
        department: 'Service',
        hireDate: new Date(),
        contractType: 'Stage',
        salary: 1800,
        hasCompanyCar: false,
      },
      'user-id',
    );

    const result = await workerService.getWorkerByIdService('worker-1');

    expect(result).toBeDefined();
    expect(result.id).toBe('worker-1');
  });

  it('should throw NotFoundException when worker is missing', async () => {
    await expect(workerService.getWorkerByIdService('missing')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update worker successfully', async () => {
    await workerService.createWorkerService(
      {
        firstName: 'Test4',
        lastName: 'Worker4',
        email: 'worker4@example.com',
        phoneNumber: '+21622223333',
        city: 'Sfax',
        jobTitle: 'Technician',
        department: 'Field',
        hireDate: new Date(),
        contractType: 'Freelance',
        salary: 2200,
        hasCompanyCar: true,
      },
      'user-id',
    );

    const updateDto: UpdateWorkerDto = {
      firstName: 'Test4',
      lastName: 'Worker4',
      email: 'worker4@example.com',
      phoneNumber: '+21622223333',
      city: 'Sfax',
      jobTitle: 'Senior Technician',
      department: 'Field',
      hireDate: new Date(),
      contractType: 'Freelance',
      salary: 2300,
      hasCompanyCar: true,
    };

    const result = await workerService.updateWorkerService(
      'worker-1',
      updateDto,
    );

    expect(result).toBe('Worker updated successfully');
    const saved = await workerRepository.findOneBy({ id: 'worker-1' });
    expect(saved?.jobTitle).toBe('Senior Technician');
  });

  it('should delete worker successfully', async () => {
    await workerService.createWorkerService(
      {
        firstName: 'Test5',
        lastName: 'Worker5',
        email: 'worker5@example.com',
        phoneNumber: '+21633334444',
        city: 'Bizerte',
        jobTitle: 'Agent',
        department: 'Support',
        hireDate: new Date(),
        contractType: 'CDD',
        salary: 2000,
        hasCompanyCar: false,
      },
      'user-id',
    );

    const result = await workerService.deleteWorkerService('worker-1');

    expect(result).toBe('Worker deleted successfully');
    await expect(
      workerService.getWorkerByIdService('worker-1'),
    ).rejects.toThrow(NotFoundException);
  });
});
