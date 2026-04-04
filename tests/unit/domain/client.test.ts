import { Client } from "src/domain/entities/client/client";
import { EClientType } from "src/domain/enums/client-type.enum";

describe("Client Entity", () => {
  const VALID_PF_PROPS = {
    id: "client-id-1",
    name: "João Silva",
    companyName: null,
    email: "joao@example.com",
    type: EClientType.PF,
    cpf: "529.982.247-25",
    cnpj: null,
    phone: null,
    address: {
      cep: "01310100",
      street: "Avenida Paulista",
      neighborhood: "Bela Vista",
      number: "1000",
      complement: null,
      city: "São Paulo",
      state: "SP",
    },
    companyId: "tenant-1",
    userId: "user-1",
  };

  const VALID_PJ_PROPS = {
    id: "client-id-2",
    name: "Empresa XPTO",
    companyName: "XPTO Ltda",
    email: "contato@xpto.com",
    type: EClientType.PJ,
    cpf: null,
    cnpj: "11222333000181",
    phone: null,
    address: {
      cep: "01310100",
      street: "Avenida Paulista",
      neighborhood: "Bela Vista",
      number: "1000",
      complement: null,
      city: "São Paulo",
      state: "SP",
    },
    companyId: "tenant-1",
    userId: "user-1",
  };

  it("should create PF client when valid props are provided", () => {
    const client = Client.create(VALID_PF_PROPS);
    expect(client).toBeInstanceOf(Client);
    expect(client.getId()).toBe("client-id-1");
    expect(client.getName()).toBe("João Silva");
    expect(client.getType()).toBe(EClientType.PF);
    expect(client.getCpf()).not.toBeNull();
    expect(client.getCnpj()).toBeNull();
    expect(client.getCompanyId()).toBe("tenant-1");
    expect(client.getUserId()).toBe("user-1");
  });

  it("should create PJ client when valid props are provided", () => {
    const client = Client.create(VALID_PJ_PROPS);
    expect(client).toBeInstanceOf(Client);
    expect(client.getType()).toBe(EClientType.PJ);
    expect(client.getCnpj()).not.toBeNull();
    expect(client.getCpf()).toBeNull();
    expect(client.getCompanyClientName()).toBe("XPTO Ltda");
  });

  it("should throw when id is missing", () => {
    expect(() => Client.create({ ...VALID_PF_PROPS, id: "" })).toThrow(
      "ID é obrigatório",
    );
  });

  it("should throw when name is missing", () => {
    expect(() => Client.create({ ...VALID_PF_PROPS, name: "" })).toThrow(
      "Nome é obrigatório",
    );
  });

  it("should throw when email is missing", () => {
    expect(() => Client.create({ ...VALID_PF_PROPS, email: "" })).toThrow(
      "Email é obrigatório",
    );
  });

  it("should throw when type is missing", () => {
    expect(() =>
      Client.create({ ...VALID_PF_PROPS, type: "" as unknown as EClientType }),
    ).toThrow("Tipo é obrigatório");
  });

  it("should throw when type is invalid", () => {
    expect(() =>
      Client.create({
        ...VALID_PF_PROPS,
        type: "INVALID" as unknown as EClientType,
      }),
    ).toThrow("Tipo inválido");
  });

  it("should throw when companyId is missing", () => {
    expect(() => Client.create({ ...VALID_PF_PROPS, companyId: "" })).toThrow(
      "companyId é obrigatório",
    );
  });

  it("should throw when userId is missing", () => {
    expect(() => Client.create({ ...VALID_PF_PROPS, userId: "" })).toThrow(
      "userId é obrigatório",
    );
  });

  it("should throw when PF client has no CPF", () => {
    expect(() => Client.create({ ...VALID_PF_PROPS, cpf: null })).toThrow(
      "CPF é obrigatório para clientes do tipo PF",
    );
  });

  it("should throw when PJ client has no CNPJ", () => {
    expect(() => Client.create({ ...VALID_PJ_PROPS, cnpj: null })).toThrow(
      "CNPJ é obrigatório para clientes do tipo PJ",
    );
  });

  it("should_throw_when_pf_client_has_cnpj", () => {
    expect(() =>
      Client.create({ ...VALID_PF_PROPS, cnpj: "11222333000181" }),
    ).toThrow("Cliente do tipo PF não deve ter CNPJ");
  });

  it("should_throw_when_pj_client_has_cpf", () => {
    expect(() =>
      Client.create({ ...VALID_PJ_PROPS, cpf: "529.982.247-25" }),
    ).toThrow("Cliente do tipo PJ não deve ter CPF");
  });

  it("should_throw_when_email_format_is_invalid", () => {
    expect(() =>
      Client.create({ ...VALID_PF_PROPS, email: "invalid-email" }),
    ).toThrow();
  });

  it("should_throw_when_address_is_invalid", () => {
    expect(() =>
      Client.create({
        ...VALID_PF_PROPS,
        address: { ...VALID_PF_PROPS.address, cep: "" },
      }),
    ).toThrow();
  });
});
