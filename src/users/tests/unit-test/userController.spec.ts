import { Test } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { userService } from '../../user.service';
import { RegisterDto } from '../../dtos/register.dto';
import { LoginDto } from '../../dtos/login.dto';
import { CreateUserByAdminDto } from '../../dtos/createUserByAdmin.dto';
import { UpdateUserDto } from '../../dtos/updateUser.dto';
import type { JWTPayloadType } from 'src/utils/types';
import { UserRole } from 'src/utils/enums';
import { AuthRolesGuard } from '../../guards/auth-roles.guard';
import { AuthGuard } from '../../guards/auth.guard';

const mockUserService = {
  registerUserService: jest.fn(),
  loginUserService: jest.fn(),
  createUserByAdminService: jest.fn(),
  getCurrentUserService: jest.fn(),
  getAll: jest.fn(),
  updateUserService: jest.fn(),
  deleteService: jest.fn(),
  updateUserRoleService: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let userServiceInstance: userService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: userService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthRolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    userController = moduleRef.get<UserController>(UserController);
    userServiceInstance = moduleRef.get<userService>(userService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userServiceInstance).toBeDefined();
  });

  describe('registerUser', () => {
    it('should call userService.registerUserService', async () => {
      const dto: RegisterDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
        phoneNumber: '+21612345678',
        address: 'Rue Test',
      };
      const expected = { accessToken: 'token' };
      mockUserService.registerUserService.mockResolvedValue(expected);

      const result = await userController.registerUser(dto);

      expect(result).toEqual(expected);
      expect(mockUserService.registerUserService).toHaveBeenCalledWith(dto);
    });
  });

  describe('loginUser', () => {
    it('should call userService.loginUserService', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const expected = { accessToken: 'token' };
      mockUserService.loginUserService.mockResolvedValue(expected);

      const result = await userController.loginUser(dto);

      expect(result).toEqual(expected);
      expect(mockUserService.loginUserService).toHaveBeenCalledWith(dto);
    });
  });

  describe('createUserByAdmin', () => {
    it('should call createUserByAdminService', async () => {
      const dto: CreateUserByAdminDto = {
        firstName: 'Admin',
        lastName: 'Created',
        email: 'admin.created@example.com',
        password: 'adminpass',
        phoneNumber: '+21612345679',
        address: 'Rue Admin',
        role: UserRole.RH,
      };
      const payload: JWTPayloadType = { id: 'admin-id', role: UserRole.ADMIN };
      const expected = { id: '1', ...dto };
      mockUserService.createUserByAdminService.mockResolvedValue(expected);

      const result = await userController.createUserByAdmin(dto, payload);

      expect(result).toEqual(expected);
      expect(mockUserService.createUserByAdminService).toHaveBeenCalledWith(
        dto,
        payload,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should call getCurrentUserService', async () => {
      const payload: JWTPayloadType = { id: 'user-id', role: UserRole.ADMIN };
      const expected = { id: 'user-id', firstName: 'Test' };
      mockUserService.getCurrentUserService.mockResolvedValue(expected);

      const result = await userController.getCurrentUser(payload);

      expect(result).toEqual(expected);
      expect(mockUserService.getCurrentUserService).toHaveBeenCalledWith(
        payload.id,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should call getAll', async () => {
      const expected = [{ id: '1', email: 'test@example.com' }];
      mockUserService.getAll.mockResolvedValue(expected);

      const result = await userController.getAllUsers();

      expect(result).toEqual(expected);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    it('should call updateUserService', async () => {
      const payload: JWTPayloadType = { id: 'user-id', role: UserRole.ADMIN };
      const updateDto: UpdateUserDto = {
        password: 'newpass',
        address: 'New Address',
      };
      const expected = { id: 'user-id', address: 'New Address' };
      mockUserService.updateUserService.mockResolvedValue(expected);

      const result = await userController.updateUser(payload, updateDto);

      expect(result).toEqual(expected);
      expect(mockUserService.updateUserService).toHaveBeenCalledWith(
        payload.id,
        updateDto,
      );
    });
  });

  describe('deleteUser', () => {
    it('should call deleteService', async () => {
      const payload: JWTPayloadType = { id: 'user-id', role: UserRole.ADMIN };
      const expected = { message: 'User deleted' };
      mockUserService.deleteService.mockResolvedValue(expected);

      const result = await userController.deleteUser('user-id', payload);

      expect(result).toEqual(expected);
      expect(mockUserService.deleteService).toHaveBeenCalledWith(
        'user-id',
        payload,
      );
    });
  });

  describe('updateUserRole', () => {
    it('should call updateUserRoleService', async () => {
      const payload: JWTPayloadType = { id: 'admin-id', role: UserRole.ADMIN };
      const expected = { id: 'user-id', role: UserRole.RH };
      mockUserService.updateUserRoleService.mockResolvedValue(expected);

      const result = await userController.updateUserRole(
        'user-id',
        UserRole.RH,
        payload,
      );

      expect(result).toEqual(expected);
      expect(mockUserService.updateUserRoleService).toHaveBeenCalledWith(
        'user-id',
        UserRole.RH,
        payload,
      );
    });
  });
});
