import { EUserRole } from "src/domain/enums/user-role.enum";
import { User } from "src/domain/entities/user/user";
import { UserEntity } from "src/infrastructure/persistence/entities/user.entity";
import { UserMapper } from "src/infrastructure/persistence/mappers/user/user.mapper";

describe("UserMapper", () => {
  it("Should convert UserEntity to User", () => {
    const userEntity = new UserEntity();
    userEntity.id = "cb1a9f1e-8c3b-4d5e-9f1e-8c3b4d5e9f1e";
    userEntity.name = "John";
    userEntity.email = "john.doe@example.com";
    userEntity.password = "hashedpassword";
    userEntity.role = EUserRole.ADMIN;
    userEntity.dtCreatedAt = new Date();

    const user = UserMapper.toDomainEntity(userEntity);

    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe(userEntity.id);
    expect(user.getName()).toBe(userEntity.name);
    expect(user.getEmail()).toBe(userEntity.email);
    expect(user.getRole()).toBe(userEntity.role);
  });

  it("Should convert User to UserEntity", () => {
    const user = User.create({
      id: "cb1a9f1e-8c3b-4d5e-9f1e-8c3b4d5e9f1e",
      name: "John",
      surname: null,
      email: "john.doe@example.com",
      phone: null,
      password: "hashedpassword",
      role: EUserRole.ADMIN,
    });

    const userEntity = UserMapper.toOrmEntity(user);

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

    expect(() => UserMapper.toDomainEntity(userEntity)).toThrow(
      "role inválida, deve ser 'ADMIN' ou 'SUPERVISOR'",
    );
  });

  it("Should throw an error when email is invalid", () => {
    const userEntity = new UserEntity();
    userEntity.id = "cb1a9f1e-8c3b-4d5e-9f1e-8c3b4d5e9f1e";
    userEntity.name = "John";
    userEntity.email = "invalid-email";
    userEntity.password = "hashedpassword";
    userEntity.role = EUserRole.ADMIN;
    userEntity.dtCreatedAt = new Date();

    expect(() => UserMapper.toDomainEntity(userEntity)).toThrow(
      "Formato de email inválido",
    );
  });
});
