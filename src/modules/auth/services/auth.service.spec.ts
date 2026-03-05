import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { SignupCsDto } from "../dtos/signup/signup-cs.dto";
import * as bcrypt from "bcryptjs";
import { UserRepository } from "src/domain/repositories/user.repository";

import { EUserRole } from "src/shared/enum/user-role.enum";
import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { User } from "src/domain/entities/user";
import { AuthValidator } from "src/applications/validator/auth/auth.validator";
import { UserValidator } from "src/applications/validator/user/user.validator";
import { SignupScResponseDto } from "../dtos/signup/signup-sc.dto";

jest.mock("bcryptjs");

describe("Suite Test AuthService", () => {
  let service: AuthService;
  
  let userRepo: UserRepository,
      userValidator: UserValidator,
      authValidator: AuthValidator,
      jwtService: JwtService;

  const mockUserRepo = { create: jest.fn() };
  const mockUserValidator = { existByEmail: jest.fn() };
  const mockAuthValidator = { validate: jest.fn() };
  const mockJwtService = { signAsync: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepo
        },
        {
          provide: UserValidator,
          useValue: mockUserValidator
        },
        {
          provide: AuthValidator,
          useValue: mockAuthValidator
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<UserRepository>(UserRepository);
    userValidator = module.get<UserValidator>(UserValidator);
    authValidator = module.get<AuthValidator>(AuthValidator);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe("Test signup method", () => {
      it("should create a new user", async () => {
        const body: SignupCsDto = { name: "John Doe", email: "john.doe@example.com", password: "password123" };
        const savedUser = { 
          id: 1,
          name: body.name,
          email: body.email,
          password: "hashedPassword",
          role: EUserRole.ADMIN 
        };

        mockUserValidator.existByEmail.mockResolvedValue(true);
        mockUserRepo.create.mockResolvedValue(new User());
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      
        const result = await service.signup(body);

        expect(userValidator.existByEmail).toHaveBeenCalledWith(body.email);
        expect(bcrypt.hash).toHaveBeenCalledWith(body.password, 12);
        expect(userRepo.create).toHaveBeenCalledWith({
          name: body.name,
          email: body.email,
          password: "hashedPassword",
          role: EUserRole.ADMIN
        });
        expect(result).toBeInstanceOf(SignupScResponseDto);
      });

      it("should throw an error if email already exists", async () => {
        const body: SignupCsDto = { name: "John Doe", email: "john.doe@example.com", password: "password123" };
        mockUserValidator.existByEmail.mockRejectedValue(new HttpException("Já existe um usuário com esse email", HttpStatus.BAD_REQUEST));

        await expect(service.signup(body)).rejects.toThrow();
        expect(userValidator.existByEmail).toHaveBeenCalledWith(body.email);
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(userRepo.create).not.toHaveBeenCalled();
      });
  });
  
  describe("Test signin method", () => {
    it("should return an access token", async () => {
      const body = { email: "john.doe@example.com", password: "password123" };
      const user = { id: 1, email: body.email, password: "hashedPassword", role: EUserRole.ADMIN };
      const token = "accessToken";

      mockAuthValidator.validate.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue(token);

      const result = await service.signin(body);

      expect(authValidator.validate).toHaveBeenCalledWith(body);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ 
        sub: user.id,
        email: user.email,
        role: user.role
      });
      expect(result).toEqual({ accessToken: token });
    });

    it("should throw an error if credentials are invalid", async () => {
      const body = { email: "john.doe@example.com", password: "wrongPassword" };

      mockAuthValidator.validate.mockRejectedValue(new UnauthorizedException('Credenciais inválidas - Verifique se seu email e senha'));

      await expect(service.signin(body)).rejects.toThrow();
      expect(authValidator.validate).toHaveBeenCalledWith(body);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});