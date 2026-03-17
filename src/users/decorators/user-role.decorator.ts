import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/utils/enums';

// Roles method decorator
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
