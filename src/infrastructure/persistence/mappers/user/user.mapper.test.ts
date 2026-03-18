import { EUserRole } from "../../../../shared/enum/user-role.enum";
import { User } from "../../../../domain/entities/user/user";
import { UserEntity } from "../../entities/user.entity";
import { UserMapper } from "./user.mapper";
import { EmailValueObject } from "../../../../domain/value-objetcts/email/email";
describe("UserMapper", () => {

  it("Should convert UserEntity to User", () => {
    const userEntity = new UserEntity();
    userEntity.id = "cb1a9f1e-8c3b-4d5e-9f1e-8c3b4d5e9f1e";
    userEntity.name = "John";
    userEntity.email = "john.doe@example.com";
    userEntity.password = "hashedpassword";
    userEntity.role = EUserRole.ADMIN;
    userEntity.dtCreatedAt = new Date();

    const user = UserMapper.toDomain(userEntity);

    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe(userEntity.id);
    expect(user.getName()).toBe(userEntity.name);
    expect(user.getEmail()).toBe(userEntity.email);
    expect(user.getRole()).toBe(userEntity.role);
  });

  it("Should convert UserEntity to User", () => {
    const user = new User(
      "cb1a9f1e-8c3b-4d5e-9f1e-8c3b4d5e9f1e",
      "John",
      null,
      EmailValueObject.create("john.doe@example.com"),
      null,
      "hashedpassword",
      EUserRole.ADMIN
    );

    const userEntity = UserMapper.toPersistence(user);

    expect(userEntity).toBeInstanceOf(UserEntity);
    expect(userEntity.id).toBe(user.getId());
    expect(userEntity.name).toBe(user.getName());
    expect(userEntity.email).toBe(user.getEmail());
    expect(userEntity.role).toBe(user.getRole());
  });

  it("Should throw error if User has invalid role", () => {
    const userEntity = new UserEntity();
    userEntity.id = "cb1a9f1e-8c3b-4d5e-9f1e-8c3b4d5e9f1e";
    userEntity.name = "John";
    userEntity.email = "jonhdoe@gmail.com";
    userEntity.password = "hashedpassword";
    userEntity.role = "INVALID_ROLE" as EUserRole;
    userEntity.dtCreatedAt = new Date();

    expect(
      () => UserMapper.toDomain(userEntity)
    ).toThrow("role inválida, deve ser 'ADMIN' ou 'SUPERVISOR'");
  });

  it("Should throw an error when email is invalid", () => {
    const userEntity = new UserEntity();
    userEntity.id = "cb1a9f1e-8c3b-4d5e-9f1e-8c3b4d5e9f1e";
    userEntity.name = "John";
    userEntity.email = "invalid-email";
    userEntity.password = "hashedpassword";
    userEntity.role = EUserRole.ADMIN;
    userEntity.dtCreatedAt = new Date();

    expect(
      () => UserMapper.toDomain(userEntity)
    ).toThrow("Formato de email inválido");

  });

});