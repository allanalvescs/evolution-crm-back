import { Test } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { RegisterCompanyUseCase } from "src/applications/usecases/company/register-company/register-company.usecase";
import { CompanyRepository } from "src/domain/repositories/company.repository";
import { CompanyValidator } from "src/applications/validator/company/company.validator";
import { Company } from "src/domain/entities/company/company";

describe("RegisterCompanyUseCase", () => {
  let useCase: RegisterCompanyUseCase;

  const mockCompanyRepository = { create: jest.fn() };
  const mockCompanyValidator = {
    existByCnpj: jest.fn(),
    existByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterCompanyUseCase,
        { provide: CompanyRepository, useValue: mockCompanyRepository },
        { provide: CompanyValidator, useValue: mockCompanyValidator },
      ],
    }).compile();

    useCase = module.get<RegisterCompanyUseCase>(RegisterCompanyUseCase);
    jest.clearAllMocks();
  });

  const makeInput = () => ({
    tradeName: "Minha Empresa",
    companyName: "Minha Empresa LTDA",
    cnpj: "11222333000181",
    userId: "uuid-user-001",
  });

  it("should register a company successfully and return the domain entity", async () => {
    mockCompanyValidator.existByCnpj.mockResolvedValue(undefined);
    mockCompanyValidator.existByUserId.mockResolvedValue(undefined);
    mockCompanyRepository.create.mockResolvedValue(undefined);

    const result = await useCase.execute(makeInput());

    expect(result).toBeInstanceOf(Company);
    expect(result.getTradeName()).toBe("Minha Empresa");
    expect(result.getCompanyName()).toBe("Minha Empresa LTDA");
    expect(result.getCnpj()).toBe("11222333000181");
    expect(result.getUserId()).toBe("uuid-user-001");
    expect(result.getPhone()).toBeNull();
    expect(result.getId()).toBeDefined();

    expect(mockCompanyValidator.existByCnpj).toHaveBeenCalledWith(
      "11222333000181",
    );
    expect(mockCompanyValidator.existByUserId).toHaveBeenCalledWith(
      "uuid-user-001",
    );
    expect(mockCompanyRepository.create).toHaveBeenCalledWith(
      expect.any(Company),
    );
  });

  it("should register a company with optional phone", async () => {
    mockCompanyValidator.existByCnpj.mockResolvedValue(undefined);
    mockCompanyValidator.existByUserId.mockResolvedValue(undefined);
    mockCompanyRepository.create.mockResolvedValue(undefined);

    const result = await useCase.execute({
      ...makeInput(),
      phone: "11987654321",
    });

    expect(result.getPhone()).toBe("(11) 98765-4321");
  });

  it("should throw when CNPJ is already registered", async () => {
    mockCompanyValidator.existByCnpj.mockRejectedValue(
      new ConflictException("Já existe uma empresa com esse CNPJ"),
    );

    await expect(useCase.execute(makeInput())).rejects.toThrow(
      ConflictException,
    );
    expect(mockCompanyRepository.create).not.toHaveBeenCalled();
  });

  it("should throw when user already has a company", async () => {
    mockCompanyValidator.existByCnpj.mockResolvedValue(undefined);
    mockCompanyValidator.existByUserId.mockRejectedValue(
      new ConflictException("Usuário já possui uma empresa cadastrada"),
    );

    await expect(useCase.execute(makeInput())).rejects.toThrow(
      ConflictException,
    );
    expect(mockCompanyRepository.create).not.toHaveBeenCalled();
  });
});
