import { Test } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { ClientCreateUseCase } from "src/applications/usecases/client/client-create/client-create.usecase";
import { ClientRepository } from "src/domain/repositories/client.repository";

describe("ClientCreateUseCase", () => {
  let useCase: ClientCreateUseCase;

  const mockClientRepository = { create: jest.fn() };
  const mockClientValidator = {
    existByCpf: jest.fn(),
    existByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ClientCreateUseCase,
        { provide: ClientRepository, useValue: mockClientRepository },
        { provide: ClientValidator, useValue: mockClientValidator },
      ],
    }).compile();

    useCase = module.get<ClientCreateUseCase>(ClientCreateUseCase);
    jest.clearAllMocks();
  });
});
