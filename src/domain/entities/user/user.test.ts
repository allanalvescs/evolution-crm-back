import { User } from "./user";
import { EmailValueObject } from "../../value-objetcts/email/email";
import { PhoneValueObject } from "../../value-objetcts/phone/phone";

describe("User Entity", () => {
  it("Should create an instance of User with valid properties", () => {
    const email = EmailValueObject.create("john.doe@example.com");
    const user = new User(
      "123e4567-e89b-12d3-a456-426614174000",
      "John",
      "Doe",
      email,
      null,
      "hashedpassword123",
      "ADMIN",
    );

    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(user.getEmail()).toBe("john.doe@example.com");
  });

  it("Should throw an error if required properties are missing", () => {
    const email = EmailValueObject.create("john.doe@example.com");
    expect(() => {
      new User("", "John", "Doe", email, null, "hashedpassword123", "ADMIN");
    }).toThrow("ID é obrigatório");

    expect(() => {
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "",
        "",
        email,
        null,
        "hashedpassword123",
        "ADMIN",
      );
    }).toThrow("name é obrigatório");

    expect(() => {
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "Doe",
        email,
        null,
        "",
        "ADMIN",
      );
    }).toThrow("password é obrigatório");
  });

  it("Should throw an error if email is invalid", () => {
    expect(() => {
      const email = EmailValueObject.create("invalid-email");
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "",
        email,
        null,
        "hashedpassword123",
        "ADMIN",
      );
    }).toThrow("Formato de email inválido");
  });

  it("Should throw an error if phone is invalid", () => {
    expect(() => {
      const email = EmailValueObject.create("john.doe@example.com");
      const phone = PhoneValueObject.create("invalid-phone");
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "Doe",
        email,
        phone,
        "hashedpassword123",
        "ADMIN",
      );
    }).toThrow("Telefone inválido");
  });

  it("Should thow an error when role is invalid", () => {
    expect(() => {
      const email = EmailValueObject.create("jonhdoe@gmail.com");
      new User(
        "123e4567-e89b-12d3-a456-426614174000",
        "John",
        "",
        email,
        null,
        "hashedpassword123",
        "invalid-role",
      );
    }).toThrow("role inválida, deve ser 'ADMIN' ou 'SUPERVISOR'");
  });
});
