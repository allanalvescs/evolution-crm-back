import { AddressValueObject } from "src/domain/value-objects/address/address";

describe("AddressValueObject", () => {
  const VALID_PROPS = {
    cep: "01310100",
    street: "Avenida Paulista",
    neighborhood: "Bela Vista",
    number: "1000",
    complement: null,
    city: "São Paulo",
    state: "SP",
  };

  it("should create instance when valid props are provided", () => {
    const address = AddressValueObject.create(VALID_PROPS);
    expect(address).toBeInstanceOf(AddressValueObject);
    expect(address.getCep()).toBe("01310100");
    expect(address.getStreet()).toBe("Avenida Paulista");
    expect(address.getNeighborhood()).toBe("Bela Vista");
    expect(address.getNumber()).toBe("1000");
    expect(address.getComplement()).toBeNull();
    expect(address.getCity()).toBe("São Paulo");
    expect(address.getState()).toBe("SP");
  });

  it("should create instance with complement when provided", () => {
    const address = AddressValueObject.create({
      ...VALID_PROPS,
      complement: "Apto 42",
    });
    expect(address.getComplement()).toBe("Apto 42");
  });

  it("should throw when cep is empty", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, cep: "" }),
    ).toThrow("CEP é obrigatório");
  });

  it("should throw when cep has less than 8 digits", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, cep: "0131010" }),
    ).toThrow("CEP inválido");
  });

  it("should throw when cep has more than 8 digits", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, cep: "013101000" }),
    ).toThrow("CEP inválido");
  });

  it("should throw when cep has non-numeric characters", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, cep: "0131010A" }),
    ).toThrow("CEP inválido");
  });

  it("should throw when street is empty", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, street: "" }),
    ).toThrow("Rua é obrigatória");
  });

  it("should throw when neighborhood is empty", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, neighborhood: "" }),
    ).toThrow("Bairro é obrigatório");
  });

  it("should throw when number is empty", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, number: "" }),
    ).toThrow("Número é obrigatório");
  });

  it("should throw when city is empty", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, city: "" }),
    ).toThrow("Cidade é obrigatória");
  });

  it("should throw when state is empty", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, state: "" }),
    ).toThrow("Estado é obrigatório");
  });

  it("should throw when state is invalid UF", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, state: "XX" }),
    ).toThrow("Estado inválido");
  });

  it("should throw when state has lowercase letters", () => {
    expect(() =>
      AddressValueObject.create({ ...VALID_PROPS, state: "sp" }),
    ).toThrow("Estado inválido");
  });
});
