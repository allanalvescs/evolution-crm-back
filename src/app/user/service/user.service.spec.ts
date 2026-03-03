import { Test } from "@nestjs/testing";
import { UserRepository } from "src/domain/repositories/user.repository";
import { UserService } from "./user.service";
import { EUserRole } from "src/shared/enum/user-role.enum";

describe("Suite Test UserService", () => {
  let service: UserService;
  let userRepository: UserRepository;

  const mockUserRepo = { findById: jest.fn() };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepo
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  describe("test me method", () => {
    it("should return user data", async () => {
      const payload = { 
        id: 1, 
        name: "John Doe", 
        email: "john.doe@example.com",
        role: EUserRole.ADMIN 
      };
      mockUserRepo.findById.mockResolvedValue(payload);

      const result = await service.me(payload);
      expect(result).toEqual(payload);
      expect(mockUserRepo.findById).toHaveBeenCalledWith(payload.id);
    });
  });
});