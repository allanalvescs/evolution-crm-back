import { Test } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";

describe("Suite Test AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    signin: jest.fn(),
    signup: jest.fn(),
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: mockAuthService
      }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });
  

  describe("Test signin method", () => {
    it("should call authService signin method", async () => {
      const signinCsDto = {
        email: "allan@gmail.com",
        password: "12345678"
      };
      const result = await controller.signin(signinCsDto);

      expect(mockAuthService.signin).toHaveBeenCalledWith(signinCsDto);
    });
  });

  describe("Test signup method", () => {
    it("should call authService signup method", async () => {
      const signupCsDto = {
        name: "Allan",
        email: "allan@gmail.com",
        password: "12345678"
      };

      await controller.signup(signupCsDto);
      expect(mockAuthService.signup).toHaveBeenCalledWith(signupCsDto);
    });
  });
  });