import { AuthValidator } from "./auth.validator";
import { Test } from "@nestjs/testing";

import * as bcrypt from "bcryptjs";
import { UserRepository } from "src/domain/repositories/user.repository";
import { User } from "src/domain/entities/user";

jest.mock("bcryptjs");

describe("Suite Test AuthValidator", () => {
  let validator: AuthValidator;

  let userRepository: UserRepository;
  const mockUserRepository = { findByEmail: jest.fn() };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthValidator,
        {
          provide: UserRepository,
          useValue: mockUserRepository
        }
      ]
    }).compile();

    validator = module.get<AuthValidator>(AuthValidator);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it("should validate user credentials successfully", async () => {
    const email = "john.doe@example.com";
    const password = "password123";

    mockUserRepository.findByEmail.mockResolvedValue(new User());
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await validator.validate({ email, password });

    expect(result).toBeInstanceOf(User);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  it("should throw an error because credentials are invalid - email not found", async () => {
    const email = "john.doe@example.com";
    const password = "password123";

    mockUserRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(validator.validate({ email, password })).rejects.toThrow();
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

    it("should throw an error because credentials are invalid - password incorrect", async () => {
    const email = "john.doe@example.com";
    const password = "password123";

    mockUserRepository.findByEmail.mockResolvedValue(new User());
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(validator.validate({ email, password })).rejects.toThrow();
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });
});