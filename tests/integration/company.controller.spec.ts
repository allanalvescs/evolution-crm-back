import { Test } from "@nestjs/testing";
import { ConflictException, HttpStatus } from "@nestjs/common";
import { CompanyController } from "src/modules/company/company.controller";
import { CompanyService } from "src/modules/company/service/company.service";
import { RegisterCompanyCsDto } from "src/modules/company/dtos/register-company/register-company-cs.dto";

describe("CompanyController", () => {
  let controller: CompanyController;

  const mockCompanyService = { register: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: mockCompanyService }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    jest.clearAllMocks();
  });

  const makeDto = (): RegisterCompanyCsDto => ({
    tradeName: "Minha Empresa",
    companyName: "Minha Empresa LTDA",
    cnpj: "11222333000181",
  });

  const makePayload = () => ({
    id: "uuid-user-001",
    email: "user@example.com",
    role: "ADMIN",
  });

  const makeServiceResult = () => ({
    id: "uuid-company-001",
    tradeName: "Minha Empresa",
    companyName: "Minha Empresa LTDA",
    cnpj: "11222333000181",
    phone: null,
    userId: "uuid-user-001",
    dtCreatedAt: new Date(),
  });

  it("should call companyService.register with correct args and return result", async () => {
    const expected = makeServiceResult();
    mockCompanyService.register.mockResolvedValue(expected);

    const result = await controller.register(makeDto(), makePayload());

    expect(mockCompanyService.register).toHaveBeenCalledWith(
      makeDto(),
      "uuid-user-001",
    );
    expect(result).toEqual(expected);
  });

  it("should propagate ConflictException when CNPJ is duplicated", async () => {
    mockCompanyService.register.mockRejectedValue(
      new ConflictException("Já existe uma empresa com esse CNPJ"),
    );

    await expect(controller.register(makeDto(), makePayload())).rejects.toThrow(
      ConflictException,
    );
  });

  it("should propagate ConflictException when user already has company", async () => {
    mockCompanyService.register.mockRejectedValue(
      new ConflictException("Usuário já possui uma empresa cadastrada"),
    );

    await expect(controller.register(makeDto(), makePayload())).rejects.toThrow(
      ConflictException,
    );
  });
});
