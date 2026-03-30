import { User } from "src/domain/entities/user/user";
import { EUserRole } from "src/domain/enums/user-role.enum";

describe("User Entity", () => {
  it("Should create an instance of User with valid properties", () => {
    const user = User.create({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      phone: null,
      password: "hashedpassword123",
      role: EUserRole.ADMIN,
    });

    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(user.getEmail()).toBe("john.doe@example.com");
  });

  it("Should throw an error if required properties are missing", () => {
    expect(() => {
      User.create({
        id: "",
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        phone: null,
        password: "hashedpassword123",
        role: EUserRole.ADMIN,
      });
    }).toThrow("ID é obrigatório");

    expect(() => {
      User.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "",
        surname: "",
        email: "john.doe@example.com",
        phone: null,
        password: "hashedpassword123",
        role: EUserRole.ADMIN,
      });
    }).toThrow("name é obrigatório");

    expect(() => {
      User.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        phone: null,
        password: "",
        role: EUserRole.ADMIN,
      });
    }).toThrow("password é obrigatório");
  });

  it("Should throw an error if email is invalid", () => {
    expect(() => {
      User.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "John",
        surname: "",
        email: "invalid-email",
        phone: null,
        password: "hashedpassword123",
        role: EUserRole.ADMIN,
      });
    }).toThrow("Formato de email inválido");
  });

  it("Should throw an error if phone is invalid", () => {
    expect(() => {
      User.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        phone: "invalid-phone",
        password: "hashedpassword123",
        role: EUserRole.ADMIN,
      });
    }).toThrow("Telefone inválido");
  });

  it("Should thow an error when role is invalid", () => {
    expect(() => {
      User.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "John",
        surname: "",
        email: "jonhdoe@gmail.com",
        phone: null,
        password: "hashedpassword123",
        role: "invalid-role" as unknown as EUserRole,
      });
    }).toThrow("role inválida, deve ser 'ADMIN' ou 'SUPERVISOR'");
  });
});
