export interface SigninUseCaseInterface {
  email: string;
  password: string;
}

export interface SigninUseCaseResult {
  accessToken: string;
}
