import { CnpjValueObject } from "src/domain/value-objects/cnpj/cnpj";
import { PhoneValueObject } from "src/domain/value-objects/phone/phone";

type CompanyProps = {
  id: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  phone: string | null;
  userId: string;
  dtCreatedAt?: Date;
  dtUpdatedAt?: Date | null;
};

export class Company {
  private readonly id: string;
  private readonly tradeName: string;
  private readonly companyName: string;
  private readonly cnpj: CnpjValueObject;
  private readonly phone: PhoneValueObject | null;
  private readonly userId: string;
  private readonly dtCreatedAt: Date;
  private dtUpdatedAt: Date | null;

  private constructor(props: CompanyProps) {
    this.validateRequiredFields(props);

    this.id = props.id;
    this.tradeName = props.tradeName;
    this.companyName = props.companyName;
    this.cnpj = CnpjValueObject.create(props.cnpj);
    this.phone = props.phone ? PhoneValueObject.create(props.phone) : null;
    this.userId = props.userId;
    this.dtCreatedAt = props.dtCreatedAt ?? new Date();
    this.dtUpdatedAt = props.dtUpdatedAt ?? null;
  }

  static create(props: CompanyProps): Company {
    return new Company(props);
  }

  getId(): string {
    return this.id;
  }

  getTradeName(): string {
    return this.tradeName;
  }

  getCompanyName(): string {
    return this.companyName;
  }

  getCnpj(): string {
    return this.cnpj.getValue();
  }

  getPhone(): string | null {
    return this.phone?.getPhone() ?? null;
  }

  getUserId(): string {
    return this.userId;
  }

  getDtCreatedAt(): Date {
    return this.dtCreatedAt;
  }

  getDtUpdatedAt(): Date | null {
    return this.dtUpdatedAt;
  }

  private validateRequiredFields(props: CompanyProps): void {
    if (!props.id) throw new Error("ID é obrigatório");
    if (!props.tradeName) throw new Error("Nome fantasia é obrigatório");
    if (!props.companyName) throw new Error("Razão Social é obrigatória");
    if (!props.cnpj) throw new Error("CNPJ é obrigatório");
    if (!props.userId) throw new Error("userId é obrigatório");
  }
}
