import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userService } from '../../user.service';
import { User } from '../../entity/user.entity';
import type { Repository, FindOneOptions } from 'typeorm';
import { AuthProviders } from '../../providers/auth.providers';
import { CreateUserByAdminDto } from '../../dtos/createUserByAdmin.dto';
import { RegisterDto } from '../../dtos/register.dto';
import { LoginDto } from '../../dtos/login.dto';
import { UserRole } from 'src/utils/enums';

type MockUserRepository = Partial<Repository<User>> & {
  find: jest.MockedFunction<() => Promise<User[]>>;
  findOne: jest.MockedFunction<
    (options?: FindOneOptions<User>) => Promise<User | null>
  >;
  save: jest.MockedFunction<(user: User) => Promise<User>>;
  remove: jest.MockedFunction<(user: User) => Promise<User>>;
};

describe('UserService Integration Tests', () => {
  let userServiceInstance: userService;
  let authProviders: AuthProviders;
  let usersData: User[] = [];

  const mockRepository: MockUserRepository = {
    find: jest.fn(() => usersData),
    findOne: jest.fn((options?: FindOneOptions<User>) => {
      const { where } = options || {};
      if (!where) return null;
      if (where.id)
        return usersData.find((user) => user.id === where.id) || null;
      if (where.email)
        return usersData.find((user) => user.email === where.email) || null;
      return null;
    }),
    save: jest.fn((user: User) => {
      const index = usersData.findIndex((item) => item.id === user.id);
      if (index >= 0) usersData[index] = user;
      else usersData.push(user);
      return user;
    }),
    remove: jest.fn((user: User) => {
      usersData = usersData.filter((item) => item.id !== user.id);
      return user;
    }),
  };

  const mockAuthProviders = {
    registerUserProvider: jest.fn((dto: RegisterDto) => ({
      accessToken: 'register-token',
      user: { ...dto, id: 'user-1' },
    })),
    loginUserProvider: jest.fn((dto: LoginDto) => ({
      accessToken: 'login-token',
      user: { email: dto.email, id: 'user-1' },
    })),
    createUserByAdminProvider: jest.fn(
      (dto: CreateUserByAdminDto, role: UserRole) => ({
        id: 'user-2',
        ...dto,
        role,
      }),
    ),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        userService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: AuthProviders,
          useValue: mockAuthProviders,
        },
      ],
    }).compile();

    userServiceInstance = module.get<userService>(userService);
    authProviders = module.get<typeof mockAuthProviders>(AuthProviders);
  });

  afterEach(() => {
    usersData = [];
    jest.clearAllMocks();
  });

  it('should register a user', async () => {
    const dto: RegisterDto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
    };

    const result = await userServiceInstance.registerUserService(dto);

    expect(result).toMatchObject({
      accessToken: 'register-token',
    });
    expect(result.user).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authProviders.registerUserProvider).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const dto: LoginDto = { email: 'test@example.com', password: 'password' };

    const result = await userServiceInstance.loginUserService(dto);

    expect(result).toMatchObject({
      accessToken: 'login-token',
    });
    expect(result.user).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authProviders.loginUserProvider).toHaveBeenCalledWith(dto);
  });

  it('should create a user by admin', async () => {
    const dto: CreateUserByAdminDto = {
      firstName: 'Admin',
      lastName: 'Created',
      email: 'admin.created@example.com',
      password: 'adminpass',
      phoneNumber: '+21612345679',
      address: 'Rue Admin',
      role: UserRole.RH,
    };
    const currentUser = { id: 'admin-id', role: UserRole.ADMIN };

    const result = await userServiceInstance.createUserByAdminService(
      dto,
      currentUser,
    );

    expect(result).toEqual({ id: 'user-2', ...dto, role: UserRole.RH });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authProviders.createUserByAdminProvider).toHaveBeenCalledWith(
      dto,
      dto.role,
    );
  });

  it('should reject createUserByAdminService for non-admin', async () => {
    const dto: CreateUserByAdminDto = {
      firstName: 'User',
      lastName: 'Created',
      email: 'user.created@example.com',
      password: 'userpass',
      phoneNumber: '+21612345670',
      address: 'Rue User',
      role: UserRole.RH,
    };
    const currentUser = { id: 'user-id', role: UserRole.RH };

    await expect(
      userServiceInstance.createUserByAdminService(dto, currentUser),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should return current user', async () => {
    const user: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.ADMIN,
    } as User;
    usersData.push(user);

    const result = await userServiceInstance.getCurrentUserService('user-1');

    expect(result).toEqual(user);
  });

  it('should throw NotFoundException for missing current user', async () => {
    await expect(
      userServiceInstance.getCurrentUserService('missing'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return all users', async () => {
    usersData.push({
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.ADMIN,
    } as User);

    const result = await userServiceInstance.getAll();

    expect(result).toHaveLength(1);
  });

  it('should update user password and address', async () => {
    const user: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'oldpass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.ADMIN,
    } as User;
    usersData.push(user);

    const result = await userServiceInstance.updateUserService('user-1', {
      password: 'newpass',
      address: 'New Address',
    });

    expect(result.address).toBe('New Address');
    expect(result.password).not.toBe('oldpass');
    expect(result.password).toBeDefined();
  });

  it('should delete user when same id provided', async () => {
    const user: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.RH,
    } as User;
    usersData.push(user);

    const result = await userServiceInstance.deleteService('user-1', {
      id: 'user-1',
      role: UserRole.RH,
    });

    expect(result).toEqual({ message: 'User has been deleted' });
  });

  it('should delete user when admin role provided', async () => {
    const user: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.RH,
    } as User;
    usersData.push(user);

    const result = await userServiceInstance.deleteService('user-1', {
      id: 'admin-id',
      role: UserRole.ADMIN,
    });

    expect(result).toEqual({ message: 'User has been deleted' });
  });

  it('should reject deleteService for unauthorized user', async () => {
    const user: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.RH,
    } as User;
    usersData.push(user);

    await expect(
      userServiceInstance.deleteService('user-1', {
        id: 'other-id',
        role: UserRole.RH,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should update user role when admin', async () => {
    const user: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.RH,
    } as User;
    usersData.push(user);

    const result = await userServiceInstance.updateUserRoleService(
      'user-1',
      UserRole.ADMIN,
      { id: 'admin-id', role: UserRole.ADMIN },
    );

    expect(result.role).toBe(UserRole.ADMIN);
    expect(result.id).toBe('user-1');
  });

  it('should reject updateUserRoleService for non-admin', async () => {
    const user: User = {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      phoneNumber: '+21612345678',
      address: 'Rue Test',
      role: UserRole.RH,
    } as User;
    usersData.push(user);

    await expect(
      userServiceInstance.updateUserRoleService('user-1', UserRole.ADMIN, {
        id: 'user-1',
        role: UserRole.RH,
      }),
    ).rejects.toThrow(ForbiddenException);
  });
});
