import { EmailValueObject } from "src/domain/value-objetcts/email/email";
import { PhoneValueObject } from "src/domain/value-objetcts/phone/phone";
import { EUserRole } from "src/shared/enum/user-role.enum";


export class User {
  private readonly id: string;
  private readonly name: string;
  private readonly surname: string | null;
  private readonly email: EmailValueObject;
  private readonly phone: PhoneValueObject | null = null;
  private readonly password: string;
  private readonly role: string;

  private readonly roles = Object.values(EUserRole);
  constructor(
    id: string,
    name: string,
    surname: string | null,
    email: EmailValueObject,
    phone: PhoneValueObject | null,
    password: string,
    role: string,
  ) {
    this.validateRequiredFields(id, name, password, role);
        
    if (!this.roles.includes(role as EUserRole)) 
      throw new Error("role inválida, deve ser 'ADMIN' ou 'SUPERVISOR'");

    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
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

  getRole(): string {
    return this.role;
  }

  getPhone(): string | null {
    return this.phone?.getPhone() ?? null;
  }

  private validateRequiredFields(id: string, name: string, password: string, role: string): void {
    if (!id) throw new Error('ID é obrigatório');

    if (!name) throw new Error('name é obrigatório');

    if (!password) throw new Error('password é obrigatório');

    if (!role) throw new Error('role é obrigatório');
  }
}