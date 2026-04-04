import { EClientType } from "../../enums/client-type.enum";
import {
  AddressProps,
  AddressValueObject,
} from "../../value-objects/address/address";
import { CnpjValueObject } from "../../value-objects/cnpj/cnpj";
import { CpfValueObject } from "../../value-objects/cpf/cpf";
import { EmailValueObject } from "../../value-objects/email/email";
import { PhoneValueObject } from "../../value-objects/phone/phone";

export type ClientProps = {
  id: string;
  name: string;
  companyName: string | null;
  email: string;
  type: EClientType;
  cpf: string | null;
  cnpj: string | null;
  phone: string | null;
  address: AddressProps;
  companyId: string;
  userId: string;
};

export class Client {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly companyName: string | null,
    private readonly email: EmailValueObject,
    private readonly type: EClientType,
    private readonly cpf: CpfValueObject | null,
    private readonly cnpj: CnpjValueObject | null,
    private readonly phone: PhoneValueObject | null,
    private readonly address: AddressValueObject,
    private readonly companyId: string,
    private readonly userId: string,
  ) {
    this.validateFields({
      id,
      name,
      type,
      companyId,
      userId,
    });
    this.email.validate();
    this.validateType(type);

    this.id = id;
    this.name = name;
    this.companyName = companyName;
    this.email = email;
    this.type = type;
    this.cpf = cpf;
    this.cnpj = cnpj;
    this.phone = phone;
    this.address = address;
    this.companyId = companyId;
    this.userId = userId;
  }

  static create(props: ClientProps): Client {
    const email = EmailValueObject.create(props.email);
    const cpf = props.cpf ? CpfValueObject.create(props.cpf) : null;
    const cnpj = props.cnpj ? CnpjValueObject.create(props.cnpj) : null;
    const phone = props.phone ? PhoneValueObject.create(props.phone) : null;
    const address = AddressValueObject.create(props.address);

    return new Client(
      props.id,
      props.name,
      props.companyName,
      email,
      props.type,
      cpf,
      cnpj,
      phone,
      address,
      props.companyId,
      props.userId,
    );
  }

  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getCompanyClientName(): string | null {
    return this.companyName;
  }
  getEmail(): EmailValueObject {
    return this.email;
  }
  getType(): EClientType {
    return this.type;
  }
  getCpf(): CpfValueObject | null {
    return this.cpf;
  }
  getCnpj(): CnpjValueObject | null {
    return this.cnpj;
  }
  getPhone(): PhoneValueObject | null {
    return this.phone;
  }
  getAddress(): AddressValueObject {
    return this.address;
  }
  getCompanyId(): string {
    return this.companyId;
  }
  getUserId(): string {
    return this.userId;
  }

  private validateFields(fields: {
    id: string;
    name: string;
    type: EClientType;
    companyId: string;
    userId: string;
  }): void {
    if (!fields.id) throw new Error("ID é obrigatório");
    if (!fields.name) throw new Error("Nome é obrigatório");
    if (!fields.type) throw new Error("Tipo é obrigatório");
    if (fields.type !== EClientType.PF && fields.type !== EClientType.PJ) {
      throw new Error("Tipo inválido");
    }
    if (!fields.companyId) throw new Error("companyId é obrigatório");
    if (!fields.userId) throw new Error("userId é obrigatório");
  }

  validateType(type: EClientType): void {
    if (type === EClientType.PF && this.cnpj !== null) {
      throw new Error("Cliente do tipo PF não deve ter CNPJ");
    }

    if (type === EClientType.PJ && this.cpf !== null) {
      throw new Error("Cliente do tipo PJ não deve ter CPF");
    }

    if (type === EClientType.PF && !this.cpf) {
      throw new Error("CPF é obrigatório para clientes do tipo PF");
    }

    if (type === EClientType.PJ && !this.cnpj) {
      throw new Error("CNPJ é obrigatório para clientes do tipo PJ");
    }
  }
}
