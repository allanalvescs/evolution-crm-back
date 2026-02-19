import { Test } from "@nestjs/testing";
import { UserService } from "./service/user.service";
import { UserController } from "./user.controller";
import { EUserRole } from "src/utils/enum/user-role.enum";

describe("Suite Test UserController", () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = { me: jest.fn() };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

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
      mockUserService.me.mockResolvedValue(payload);

      const result = await controller.me(payload);
      expect(result).toEqual(payload);
      expect(mockUserService.me).toHaveBeenCalledWith(payload);
    });
  });
});