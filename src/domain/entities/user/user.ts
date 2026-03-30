import { EmailValueObject } from "src/domain/value-objects/email/email";
import { PhoneValueObject } from "src/domain/value-objects/phone/phone";
import { EUserRole } from "src/domain/enums/user-role.enum";

export class User {
  private readonly id: string;
  private readonly name: string;
  private readonly surname: string | null;
  private readonly email: EmailValueObject;
  private readonly phone: PhoneValueObject | null = null;
  private readonly password: string;
  private readonly role: EUserRole;

  private dtLastLoginAt?: Date | null;
  private dtCreatedAt: Date;
  private dtUpdatedAt?: Date | null;

  private readonly roles = Object.values(EUserRole);
  constructor(
    id: string,
    name: string,
    surname: string | null,
    email: string,
    phone: string | null,
    password: string,
    role: EUserRole,
  ) {
    this.validateRequiredFields(id, name, password, role);

    if (!this.roles.includes(role))
      throw new Error("role inválida, deve ser 'ADMIN' ou 'SUPERVISOR'");

    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = EmailValueObject.create(email);
    this.phone = phone ? PhoneValueObject.create(phone) : null;
    this.password = password;
    this.role = role;

    this.dtCreatedAt = new Date();
    this.dtUpdatedAt = null;
    this.dtLastLoginAt = null;
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email.getEmail();
  }

  getName(): string {
    return this.name;
  }

  getSurname(): string | null {
    return this.surname;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): EUserRole {
    return this.role;
  }

  getPhone(): string | null {
    return this.phone?.getPhone() ?? null;
  }

  private validateRequiredFields(
    id: string,
    name: string,
    password: string,
    role: string,
  ): void {
    if (!id) throw new Error("ID é obrigatório");

    if (!name) throw new Error("name é obrigatório");

    if (!password) throw new Error("password é obrigatório");

    if (!role) throw new Error("role é obrigatório");
  }
}
