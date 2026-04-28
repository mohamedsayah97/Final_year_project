import { Test } from '@nestjs/testing';
import { InvoiceController } from '../../invoice.controller';
import { InvoiceService } from '../../invoice.service';
import { CreateInvoiceDto } from '../../dtos/createInvoice.dto';
import { UpdateInvoiceDto } from '../../dtos/updateInvoice.dto';
import type { JWTPayloadType } from 'src/utils/types';
import { UserRole } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';

const mockInvoiceService = {
  createInvoiceService: jest.fn(),
  getAllInvoicesService: jest.fn(),
  getInvoiceById: jest.fn(),
  updateInvoice: jest.fn(),
  deleteInvoice: jest.fn(),
};

describe('InvoiceController', () => {
  let invoiceController: InvoiceController;
  let invoiceService: InvoiceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    })
      .overrideGuard(AuthRolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    invoiceController = moduleRef.get<InvoiceController>(InvoiceController);
    invoiceService = moduleRef.get<InvoiceService>(InvoiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(invoiceController).toBeDefined();
    expect(invoiceService).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        invoiceNumber: 'INV-1001',
        date: new Date(),
        dueDate: new Date(),
        totalAmount: 1234.56,
        taxAmount: 123.45,
        status: 'pending',
        paymentTerms: '30 days',
      };

      const payload: JWTPayloadType = { id: 'user-id', role: UserRole.ADMIN };
      const expected = { id: '1', ...createInvoiceDto };

      mockInvoiceService.createInvoiceService.mockResolvedValue(expected);

      const result = await invoiceController.createInvoice(
        createInvoiceDto,
        payload,
      );

      expect(result).toEqual(expected);
      expect(mockInvoiceService.createInvoiceService).toHaveBeenCalledWith(
        createInvoiceDto,
        payload.id,
      );
    });

    it('should forward create errors', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        invoiceNumber: 'INV-1002',
        date: new Date(),
        dueDate: new Date(),
        totalAmount: 100,
        taxAmount: 10,
        status: 'paid',
        paymentTerms: 'immediate',
      };

      const payload: JWTPayloadType = { id: 'user-id', role: UserRole.ADMIN };
      mockInvoiceService.createInvoiceService.mockRejectedValue(
        new Error('Failed'),
      );

      await expect(
        invoiceController.createInvoice(createInvoiceDto, payload),
      ).rejects.toThrow('Failed');
    });
  });

  describe('getAllInvoices', () => {
    it('should return invoices array', async () => {
      const invoices = [{ id: '1', invoiceNumber: 'INV-1001' }];
      mockInvoiceService.getAllInvoicesService.mockResolvedValue(invoices);

      const result = await invoiceController.getAllInvoices();

      expect(result).toEqual(invoices);
      expect(mockInvoiceService.getAllInvoicesService).toHaveBeenCalledTimes(1);
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice by id', async () => {
      const invoiceId = '1';
      const invoice = { id: invoiceId, invoiceNumber: 'INV-1001' };
      mockInvoiceService.getInvoiceById.mockResolvedValue(invoice);

      const result = await invoiceController.getInvoiceById(invoiceId);

      expect(result).toEqual(invoice);
      expect(mockInvoiceService.getInvoiceById).toHaveBeenCalledWith(invoiceId);
    });
  });

  describe('updateInvoice', () => {
    it('should update invoice successfully', async () => {
      const invoiceId = '1';
      const updateDto: UpdateInvoiceDto = {
        invoiceNumber: 'INV-1001',
        date: new Date(),
        dueDate: new Date(),
        totalAmount: 2000,
        taxAmount: 200,
        status: 'paid',
        paymentTerms: '15 days',
      };
      const expected = { message: 'updated' };
      mockInvoiceService.updateInvoice.mockResolvedValue(expected);

      const result = await invoiceController.updateInvoice(
        invoiceId,
        updateDto,
      );

      expect(result).toEqual(expected);
      expect(mockInvoiceService.updateInvoice).toHaveBeenCalledWith(
        invoiceId,
        updateDto,
      );
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      const invoiceId = '1';
      const expected = { message: 'deleted' };
      mockInvoiceService.deleteInvoice.mockResolvedValue(expected);

      const result = await invoiceController.deleteInvoice(invoiceId);

      expect(result).toEqual(expected);
      expect(mockInvoiceService.deleteInvoice).toHaveBeenCalledWith(invoiceId);
    });
  });
});
