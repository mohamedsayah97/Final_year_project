import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceService } from '../../invoice.service';
import { Invoice } from '../../entity/invoice.entity';
import { CreateInvoiceDto } from '../../dtos/createInvoice.dto';
import { UpdateInvoiceDto } from '../../dtos/updateInvoice.dto';
import { userService } from 'src/users/user.service';
import { Repository } from 'typeorm';

describe('InvoiceService Integration Tests', () => {
  let invoiceService: InvoiceService;
  let invoiceRepository: Repository<Invoice>;
  let invoicesData: Invoice[] = [];

  type MockRepository = Partial<Repository<Invoice>> & {
    create: jest.MockedFunction<
      (dto: CreateInvoiceDto & Partial<Invoice>) => Invoice
    >;
    save: jest.MockedFunction<(invoice: Invoice) => Promise<Invoice>>;
    find: jest.MockedFunction<() => Promise<Invoice[]>>;
    findOneBy: jest.MockedFunction<
      (criteria: Partial<Invoice>) => Promise<Invoice | null>
    >;
    remove: jest.MockedFunction<(invoice: Invoice) => Promise<Invoice>>;
  };

  const mockRepository: MockRepository = {
    create: jest.fn(
      (dto: CreateInvoiceDto) =>
        ({
          ...dto,
          id: 'invoice-1',
        }) as Invoice,
    ),
    save: jest.fn((invoice: Invoice) => {
      const existingIndex = invoicesData.findIndex(
        (item) => item.id === invoice.id,
      );
      if (existingIndex >= 0) {
        invoicesData[existingIndex] = invoice;
      } else {
        invoicesData.push(invoice);
      }
      return invoice;
    }),
    find: jest.fn(() => invoicesData),
    findOneBy: jest.fn(
      (criteria: Partial<Invoice>) =>
        invoicesData.find((item) => item.id === criteria.id) || null,
    ),
    remove: jest.fn((invoice: Invoice) => {
      invoicesData = invoicesData.filter((item) => item.id !== invoice.id);
      return invoice;
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
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockRepository,
        },
        {
          provide: userService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    invoiceService = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get<Repository<Invoice>>(
      getRepositoryToken(Invoice),
    );
  });

  afterEach(() => {
    invoicesData = [];
    jest.clearAllMocks();
  });

  it('should create an invoice successfully', async () => {
    const createInvoiceDto: CreateInvoiceDto = {
      invoiceNumber: 'INV-2001',
      date: new Date(),
      dueDate: new Date(),
      totalAmount: 1000,
      taxAmount: 100,
      status: 'issued',
      paymentTerms: '30 days',
    };

    const result = await invoiceService.createInvoiceService(
      createInvoiceDto,
      'user-id',
    );

    expect(result).toBeDefined();
    expect(result.id).toBe('invoice-1');
    expect(result.invoiceNumber).toBe('INV-2001');

    const saved = await invoiceRepository.findOneBy({ id: result.id });
    expect(saved).toBeDefined();
    expect(saved?.invoiceNumber).toBe('INV-2001');
  });

  it('should return all invoices', async () => {
    const invoice1: CreateInvoiceDto = {
      invoiceNumber: 'INV-2002',
      date: new Date(),
      dueDate: new Date(),
      totalAmount: 200,
      taxAmount: 20,
      status: 'draft',
      paymentTerms: '15 days',
    };

    await invoiceService.createInvoiceService(invoice1, 'user-id');

    const result = await invoiceService.getAllInvoicesService();

    expect(result).toHaveLength(1);
  });

  it('should return invoice by id', async () => {
    const invoice = await invoiceService.createInvoiceService(
      {
        invoiceNumber: 'INV-2003',
        date: new Date(),
        dueDate: new Date(),
        totalAmount: 500,
        taxAmount: 50,
        status: 'paid',
        paymentTerms: '7 days',
      },
      'user-id',
    );

    const result = await invoiceService.getInvoiceById(invoice.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(invoice.id);
  });

  it('should throw NotFoundException when invoice not found', async () => {
    await expect(invoiceService.getInvoiceById('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update invoice successfully', async () => {
    const invoice = await invoiceService.createInvoiceService(
      {
        invoiceNumber: 'INV-2004',
        date: new Date(),
        dueDate: new Date(),
        totalAmount: 600,
        taxAmount: 60,
        status: 'pending',
        paymentTerms: '30 days',
      },
      'user-id',
    );

    const updateDto: UpdateInvoiceDto = {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      dueDate: invoice.dueDate,
      totalAmount: 700,
      taxAmount: 70,
      status: 'paid',
      paymentTerms: '30 days',
    };

    const result = await invoiceService.updateInvoice(invoice.id, updateDto);
    expect(result).toBeDefined();
    expect(result.totalAmount).toBe(700);
  });

  it('should delete invoice successfully', async () => {
    const invoice = await invoiceService.createInvoiceService(
      {
        invoiceNumber: 'INV-2005',
        date: new Date(),
        dueDate: new Date(),
        totalAmount: 800,
        taxAmount: 80,
        status: 'issued',
        paymentTerms: '30 days',
      },
      'user-id',
    );

    const result = await invoiceService.deleteInvoice(invoice.id);

    expect(result).toEqual({
      message: `Invoice with ID ${invoice.id} has been deleted`,
    });
    await expect(invoiceService.getInvoiceById(invoice.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});
