import { Test } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { CompanyValidator } from "src/applications/validator/company/company.validator";
import { CompanyRepository } from "src/domain/repositories/company.repository";
import { Company } from "src/domain/entities/company/company";

describe("CompanyValidator", () => {
  let validator: CompanyValidator;

  const mockCompanyRepository = {
    findByCnpj: jest.fn(),
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyValidator,
        { provide: CompanyRepository, useValue: mockCompanyRepository },
      ],
    }).compile();

    validator = module.get<CompanyValidator>(CompanyValidator);
    jest.clearAllMocks();
  });

  const makeCompany = () =>
    Company.create({
      id: "uuid-company-001",
      tradeName: "Empresa Teste",
      companyName: "Empresa Teste LTDA",
      cnpj: "11222333000181",
      phone: null,
      userId: "uuid-user-001",
    });

  describe("existByCnpj", () => {
    it("should pass validation when CNPJ is not registered", async () => {
      mockCompanyRepository.findByCnpj.mockResolvedValue(null);

      await expect(
        validator.existByCnpj("11222333000181"),
      ).resolves.toBeUndefined();
      expect(mockCompanyRepository.findByCnpj).toHaveBeenCalledWith(
        "11222333000181",
      );
    });

    it("should throw ConflictException when CNPJ already exists", async () => {
      mockCompanyRepository.findByCnpj.mockResolvedValue(makeCompany());

      await expect(validator.existByCnpj("11222333000181")).rejects.toThrow(
        ConflictException,
      );
      await expect(validator.existByCnpj("11222333000181")).rejects.toThrow(
        "Já existe uma empresa com esse CNPJ",
      );
    });
  });

  describe("existByUserId", () => {
    it("should pass validation when user has no company", async () => {
      mockCompanyRepository.findByUserId.mockResolvedValue(null);

      await expect(
        validator.existByUserId("uuid-user-001"),
      ).resolves.toBeUndefined();
      expect(mockCompanyRepository.findByUserId).toHaveBeenCalledWith(
        "uuid-user-001",
      );
    });

    it("should throw ConflictException when user already has a company", async () => {
      mockCompanyRepository.findByUserId.mockResolvedValue(makeCompany());

      await expect(validator.existByUserId("uuid-user-001")).rejects.toThrow(
        ConflictException,
      );
      await expect(validator.existByUserId("uuid-user-001")).rejects.toThrow(
        "Usuário já possui uma empresa cadastrada",
      );
    });
  });
});
