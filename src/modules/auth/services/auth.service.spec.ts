import { UserValidator } from "src/applications/validator/user/user.validator";
import { AuthService } from "./auth.service";
import { FakeUserRepository } from "src/infrastructure/repositories/fakes/fake-user.repository";
import { BcryptPasswordHasher } from "src/infrastructure/services/bcrypt-password-hasher.service";
import { EmailValueObject } from "src/domain/value-objetcts/email/email";
import { User } from "src/domain/entities/user/user";
import { EUserRole } from "../../../shared/enum/user-role.enum";

jest.mock("bcryptjs");

describe("Suite Test AuthService", () => {
  let authService: AuthService;
  let fakeUserRepository: FakeUserRepository;
  let mockBcryptPasswordHasher: jest.Mocked<BcryptPasswordHasher>;
  let mockUserValidator: UserValidator;

  beforeEach(() => {
    const mockUserRepository = {} as any;

    mockBcryptPasswordHasher =
      new BcryptPasswordHasher() as jest.Mocked<BcryptPasswordHasher>;
    mockUserValidator = new UserValidator(
      mockUserRepository,
    ) as jest.Mocked<UserValidator>;

    fakeUserRepository = new FakeUserRepository();
    authService = new AuthService(
      fakeUserRepository,
      mockBcryptPasswordHasher,
      mockUserValidator,
    );
  });

  it("Should create a new user successfully", async () => {
    const mockBcrtpt = "hashedpassword";
    const newUser = new User(
      "123",
      "John Doe",
      null,
      EmailValueObject.create("johndoe@gmail.com"),
      null,
      "12345678",
      EUserRole.ADMIN,
    );
    mockBcryptPasswordHasher.hash.mockResolvedValue(mockBcrtpt);
    await fakeUserRepository.create(newUser);

    const user = await fakeUserRepository.findById("123");

    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(user?.getEmail()).toBe("johndoe@gmail.com");
    expect(user?.getPassword()).toBe("hashedpassword");
  });
});
