import { EUserRole } from "src/shared/enum/user-role.enum";

interface IUser {
  id?: number;
  name: string;
  email: string;
  surname?: string | null;
  password: string;
  role: EUserRole;
  tokenJwt?: string;
  avatarUrl?: string;
  dtLastLoginAt?: Date;
  dtCreatedAt?: Date;
  dtUpdatedAt?: Date;
}

export class User {
  id?: number;
  name: string;
  email: string;
  surname?: string | null;
  password: string;
  role: EUserRole;
  tokenJwt?: string | null;
  avatarUrl?: string | null;
  dtLastLoginAt?: Date | null;
  dtCreatedAt?: Date;
  dtUpdatedAt?: Date | null;

  assign(data: IUser) {
    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.email = data.email || this.email;
    this.surname = data.surname || this.surname;
    this.password = data.password || this.password;
    this.role = data.role || this.role;
    this.tokenJwt = data.tokenJwt || this.tokenJwt;
    this.avatarUrl = data.avatarUrl || this.avatarUrl;
    this.dtLastLoginAt = data.dtLastLoginAt || this.dtLastLoginAt;
    this.dtCreatedAt = data.dtCreatedAt || this.dtCreatedAt;
    this.dtUpdatedAt = data.dtUpdatedAt || this.dtUpdatedAt;
  }
}