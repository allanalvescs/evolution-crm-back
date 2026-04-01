import { Test } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { CompanyService } from "src/modules/company/service/company.service";
import { RegisterCompanyUseCase } from "src/applications/usecases/company/register-company/register-company.usecase";
import { Company } from "src/domain/entities/company/company";

describe("CompanyService", () => {
  let service: CompanyService;

  const mockRegisterCompanyUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: RegisterCompanyUseCase,
          useValue: mockRegisterCompanyUseCase,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    jest.clearAllMocks();
  });

  const makeCompany = () =>
    Company.create({
      id: "uuid-company-001",
      tradeName: "Minha Empresa",
      companyName: "Minha Empresa LTDA",
      cnpj: "11222333000181",
      phone: null,
      userId: "uuid-user-001",
    });

  const makeDto = () => ({
    tradeName: "Minha Empresa",
    companyName: "Minha Empresa LTDA",
    cnpj: "11222333000181",
  });

  it("should register company and return mapped DTO", async () => {
    const company = makeCompany();
    mockRegisterCompanyUseCase.execute.mockResolvedValue(company);

    const result = await service.register(makeDto() as any, "uuid-user-001");

    expect(mockRegisterCompanyUseCase.execute).toHaveBeenCalledWith({
      tradeName: "Minha Empresa",
      companyName: "Minha Empresa LTDA",
      cnpj: "11222333000181",
      phone: undefined,
      userId: "uuid-user-001",
    });

    expect(result.id).toBe("uuid-company-001");
    expect(result.tradeName).toBe("Minha Empresa");
    expect(result.companyName).toBe("Minha Empresa LTDA");
    expect(result.cnpj).toBe("11222333000181");
    expect(result.phone).toBeNull();
    expect(result.userId).toBe("uuid-user-001");
    expect(result.dtCreatedAt).toBeInstanceOf(Date);
  });

  it("should propagate ConflictException from use case (CNPJ duplicado)", async () => {
    mockRegisterCompanyUseCase.execute.mockRejectedValue(
      new ConflictException("Já existe uma empresa com esse CNPJ"),
    );

    await expect(
      service.register(makeDto() as any, "uuid-user-001"),
    ).rejects.toThrow(ConflictException);
  });

  it("should propagate ConflictException from use case (usuário já tem empresa)", async () => {
    mockRegisterCompanyUseCase.execute.mockRejectedValue(
      new ConflictException("Usuário já possui uma empresa cadastrada"),
    );

    await expect(
      service.register(makeDto() as any, "uuid-user-001"),
    ).rejects.toThrow(ConflictException);
  });
});
