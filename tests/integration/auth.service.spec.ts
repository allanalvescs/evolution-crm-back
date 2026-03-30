import { AuthService } from "src/modules/auth/services/auth.service";
import { SignupUseCase } from "src/applications/usecases/auth/signup/signup.usecase";
import { SigninUseCase } from "src/applications/usecases/auth/signin/signin.usecase";
import { User } from "src/domain/entities/user/user";
import { EUserRole } from "src/domain/enums/user-role.enum";

describe("Suite Test AuthService", () => {
  let authService: AuthService;
  let mockSignupUseCase: { execute: jest.Mock };
  let mockSigninUseCase: { execute: jest.Mock };

  const makeUser = () =>
    new User(
      "123",
      "John Doe",
      null,
      "johndoe@gmail.com",
      null,
      "hashedpassword",
      EUserRole.ADMIN,
    );

  beforeEach(() => {
    mockSignupUseCase = { execute: jest.fn() };
    mockSigninUseCase = { execute: jest.fn() };
    authService = new AuthService(
      mockSignupUseCase as unknown as SignupUseCase,
      mockSigninUseCase as unknown as SigninUseCase,
    );
  });

  it("should_call_signupUseCase_when_signup_is_invoked", async () => {
    mockSignupUseCase.execute.mockResolvedValue(makeUser());

    await authService.signup({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345678",
    } as any);

    expect(mockSignupUseCase.execute).toHaveBeenCalledWith({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "12345678",
    });
  });

  it("should_call_signinUseCase_when_signin_is_invoked", async () => {
    mockSigninUseCase.execute.mockResolvedValue({ accessToken: "token123" });

    await authService.signin({
      email: "johndoe@gmail.com",
      password: "12345678",
    } as any);

    expect(mockSigninUseCase.execute).toHaveBeenCalledWith({
      email: "johndoe@gmail.com",
      password: "12345678",
    });
  });
});
