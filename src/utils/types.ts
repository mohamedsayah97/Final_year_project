import { UserRole } from './enums';

export type JWTPayloadType = {
  id: string;
  role: UserRole;
};

export type accesTokenType = {
  accesToken: string;
};
