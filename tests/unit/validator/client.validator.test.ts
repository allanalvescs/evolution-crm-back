import { ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Client } from "src/domain/entities/client/client";
import { EClientType } from "src/domain/enums/client-type.enum";
import { ClientRepository } from "src/domain/repositories/client.repository";
import { ClientValidator } from "src/applications/validator/client/client.validator";

describe("ClientValidator", () => {
  let validator: ClientValidator;

  const mockClientRepository = {
    findByCpf: jest.fn(),
    findByCnpj: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ClientValidator,
        { provide: ClientRepository, useValue: mockClientRepository },
      ],
    }).compile();

    validator = module.get<ClientValidator>(ClientValidator);
    jest.clearAllMocks();
  });

  const makeClient = () =>
    Client.create({
      id: "uuid-client-001",
      name: "Cliente Teste",
      cpf: "52998224725",
      phone: null,
      companyId: "uuid-company-001",
      email: "joao.teste@example.com",
      type: EClientType.PF,
      companyName: "Empresa do Cliente Teste",
      userId: "uuid-user-001",
      cnpj: null,
    });

  it("Should be pass validation when CPF is not registered", async () => {
    mockClientRepository.findByCpf.mockResolvedValue(null);

    await expect(
      validator.existByCpf("52998224725", "uuid-company-001"),
    ).resolves.toBeUndefined();
    expect(mockClientRepository.findByCpf).toHaveBeenCalledWith({
      cpf: "52998224725",
      companyId: "uuid-company-001",
    });
  });

  it("Should throw ConflictException when CPF already exists", async () => {
    mockClientRepository.findByCpf.mockResolvedValue(makeClient());

    await expect(
      validator.existByCpf("52998224725", "uuid-company-001"),
    ).rejects.toThrow(ConflictException);
    await expect(
      validator.existByCpf("52998224725", "uuid-company-001"),
    ).rejects.toThrow("Já existe um cliente com esse CPF");
  });

  it("Should be pass validation when CNPJ is not registered", async () => {
    mockClientRepository.findByCnpj.mockResolvedValue(null);

    await expect(
      validator.existByCnpj("12345678000199", "uuid-company-001"),
    ).resolves.toBeUndefined();
    expect(mockClientRepository.findByCnpj).toHaveBeenCalledWith({
      cnpj: "12345678000199",
      companyId: "uuid-company-001",
    });
  });

  it("Should throw ConflictException when CNPJ already exists", async () => {
    const clientWithCnpj = makeClient();
    mockClientRepository.findByCnpj.mockResolvedValue(clientWithCnpj);

    await expect(
      validator.existByCnpj("12345678000199", "uuid-company-001"),
    ).rejects.toThrow(ConflictException);
    await expect(
      validator.existByCnpj("12345678000199", "uuid-company-001"),
    ).rejects.toThrow("Já existe um cliente com esse CNPJ");
  });
});
