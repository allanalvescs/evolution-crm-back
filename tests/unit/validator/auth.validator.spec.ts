import { AuthValidator } from "src/applications/validator/auth/auth.validator";
import { Test } from "@nestjs/testing";

import { UserRepository } from "src/domain/repositories/user.repository";
import { PasswordHasher } from "src/domain/contracts/password-hasher.interface";
import { User } from "src/domain/entities/user/user";
import { EUserRole } from "src/domain/enums/user-role.enum";

describe("Suite Test AuthValidator", () => {
  let validator: AuthValidator;

  let userRepository: UserRepository;
  const mockUserRepository = { findByEmail: jest.fn() };
  const mockPasswordHasher = { hash: jest.fn(), compare: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthValidator,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: PasswordHasher,
          useValue: mockPasswordHasher,
        },
      ],
    }).compile();

    validator = module.get<AuthValidator>(AuthValidator);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  const makeUser = () =>
    new User(
      "uuid-123",
      "John",
      null,
      "john.doe@example.com",
      null,
      "hashedpassword",
      EUserRole.ADMIN,
    );

  it("should validate user credentials successfully", async () => {
    const email = "john.doe@example.com";
    const password = "password123";

    mockUserRepository.findByEmail.mockResolvedValue(makeUser());
    mockPasswordHasher.compare.mockResolvedValue(true);

    const result = await validator.validate({ email, password });

    expect(result).toBeInstanceOf(User);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  it("should throw an error because credentials are invalid - email not found", async () => {
    const email = "john.doe@example.com";
    const password = "password123";

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.compare.mockResolvedValue(true);

    await expect(validator.validate({ email, password })).rejects.toThrow();
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  it("should throw an error because credentials are invalid - password incorrect", async () => {
    const email = "john.doe@example.com";
    const password = "password123";

    mockUserRepository.findByEmail.mockResolvedValue(makeUser());
    mockPasswordHasher.compare.mockResolvedValue(false);

    await expect(validator.validate({ email, password })).rejects.toThrow();
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });
});
