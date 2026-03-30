import { User } from "src/domain/entities/user/user";
import { EUserRole } from "src/domain/enums/user-role.enum";

describe("User Entity", () => {
  it("Should create an instance of User with valid properties", () => {
    const user = new User(
      "123e4567-e89b-12d3-a456-426614174000",
      "John",
      "Doe",
      "john.doe@example.com",
      null,
      "hashedpassword123",
      EUserRole.ADMIN,
    );

    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(user.getEmail()).toBe("john.doe@example.com");
  });

  it("Should throw an error if required properties are missing", () => {
    expect(() => {
      new User(
        "",
        "John",
        "Doe",
        "john.doe@example.com",
        null,
        "hashedpassword123",
        EUserRole.ADMIN,
      );
    }).toThrow("ID é obrigatório");

    expect(() => {
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "",
        "",
        "john.doe@example.com",
        null,
        "hashedpassword123",
        EUserRole.ADMIN,
      );
    }).toThrow("name é obrigatório");

    expect(() => {
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "Doe",
        "john.doe@example.com",
        null,
        "",
        EUserRole.ADMIN,
      );
    }).toThrow("password é obrigatório");
  });

  it("Should throw an error if email is invalid", () => {
    expect(() => {
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "",
        "invalid-email",
        null,
        "hashedpassword123",
        EUserRole.ADMIN,
      );
    }).toThrow("Formato de email inválido");
  });

  it("Should throw an error if phone is invalid", () => {
    expect(() => {
      const email = "john.doe@example.com";
      const phone = "invalid-phone";
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "Doe",
        email,
        phone,
        "hashedpassword123",
        EUserRole.ADMIN,
      );
    }).toThrow("Telefone inválido");
  });

  it("Should thow an error when role is invalid", () => {
    expect(() => {
      const email = "jonhdoe@gmail.com";
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "",
        email,
        null,
        "hashedpassword123",
        "invalid-role" as unknown as EUserRole,
      );
    }).toThrow("role inválida, deve ser 'ADMIN' ou 'SUPERVISOR'");
  });
});
