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

  // update lastActive anytime when session is 
  lastActive: Date;
}
