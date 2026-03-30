import { Test } from "@nestjs/testing";
import { UserValidator } from "src/applications/validator/user/user.validator";
import { UserRepository } from "src/domain/repositories/user.repository";
import { User } from "src/domain/entities/user/user";
import { EUserRole } from "src/domain/enums/user-role.enum";

describe("Suite Test UserValidator", () => {
  let validator: UserValidator;

  let userRepository: UserRepository;

  const mockUserRepository = { findByEmail: jest.fn() };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserValidator,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    validator = module.get<UserValidator>(UserValidator);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it("should pass validation because email not registered", async () => {
    const email = "john.doe@example.com";

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(validator.existByEmail(email)).resolves.toBeUndefined();
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  it("should throw an error because email already exists", async () => {
    const email = "john.doe@example.com";

    mockUserRepository.findByEmail.mockResolvedValue(
      new User(
        "uuid-123",
        "John",
        null,
        "john.doe@example.com",
        null,
        "hashedpassword",
        EUserRole.ADMIN,
      ),
    );

    const promise = validator.existByEmail(email);
    await expect(promise).rejects.toThrow();
    await expect(promise).rejects.toThrow(
      "Já existe um usuário com esse email",
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });
});
