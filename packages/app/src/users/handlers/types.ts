export interface UserSignupParams {
  email: string;
  password: string;

  firstName: string;
  lastName: string;
}

export interface UserLoginParams {
  email: string;
  password: string;
}
