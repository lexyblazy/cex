interface BaseEntity {
  id: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface UserEntity extends BaseEntity {
  email: string;
  password: string;

  firstName: string;
  lastName: string;
}

export interface SessionEntity extends BaseEntity {
  token: string;
  mfaVerified: string;

  // update lastActive anytime a session is used
  lastActive: Date;
}

export interface AddressEntity extends BaseEntity {
  address: string;

  derivationPath: string;

  index: number;

  asset: AssetEntity;

  user: UserEntity;
}

export interface AssetEntity extends BaseEntity {
  name: string;
  symbol: string;

  networkSymbol: string;
  description: string | null;

  tokenId: string | null; // applies to only ERC-20 tokens

  requiredConfirmations: number;
}
