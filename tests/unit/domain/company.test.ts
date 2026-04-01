import { Company } from "src/domain/entities/company/company";

describe("Company Entity", () => {
  const makeProps = (
    overrides: Partial<Parameters<typeof Company.create>[0]> = {},
  ) => ({
    id: "uuid-company-001",
    tradeName: "Minha Empresa LTDA",
    companyName: "Minha Empresa Razão Social LTDA",
    cnpj: "11222333000181",
    phone: null,
    userId: "uuid-user-001",
    ...overrides,
  });

  it("should create a Company instance with valid props", () => {
    const company = Company.create(makeProps());

    expect(company).toBeInstanceOf(Company);
    expect(company.getId()).toBe("uuid-company-001");
    expect(company.getTradeName()).toBe("Minha Empresa LTDA");
    expect(company.getCompanyName()).toBe("Minha Empresa Razão Social LTDA");
    expect(company.getCnpj()).toBe("11222333000181");
    expect(company.getPhone()).toBeNull();
    expect(company.getUserId()).toBe("uuid-user-001");
    expect(company.getDtCreatedAt()).toBeInstanceOf(Date);
    expect(company.getDtUpdatedAt()).toBeNull();
  });

  it("should create a Company with optional phone", () => {
    const company = Company.create(makeProps({ phone: "11987654321" }));
    expect(company.getPhone()).toBe("(11) 98765-4321");
  });

  it("should throw when id is empty", () => {
    expect(() => Company.create(makeProps({ id: "" }))).toThrow(
      "ID é obrigatório",
    );
  });

  it("should throw when tradeName is empty", () => {
    expect(() => Company.create(makeProps({ tradeName: "" }))).toThrow(
      "Nome fantasia é obrigatório",
    );
  });

  it("should throw when companyName is empty", () => {
    expect(() => Company.create(makeProps({ companyName: "" }))).toThrow(
      "Razão Social é obrigatória",
    );
  });

  it("should throw when cnpj is empty", () => {
    expect(() => Company.create(makeProps({ cnpj: "" }))).toThrow(
      "CNPJ é obrigatório",
    );
  });

  it("should throw when cnpj is invalid", () => {
    expect(() => Company.create(makeProps({ cnpj: "11111111111111" }))).toThrow(
      "CNPJ inválido",
    );
  });

  it("should throw when userId is empty", () => {
    expect(() => Company.create(makeProps({ userId: "" }))).toThrow(
      "userId é obrigatório",
    );
  });

  it("should throw when phone is invalid", () => {
    expect(() => Company.create(makeProps({ phone: "123" }))).toThrow(
      "Telefone inválido",
    );
  });
});
