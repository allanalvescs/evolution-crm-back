import { Expose } from "class-transformer";

export class UserMeScResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  surname!: string | null;

  @Expose()
  role!: string;

  @Expose()
  avatarUrl!: string | null;

  @Expose()
  dtLastLoginAt!: Date | null;

  @Expose()
  dtCreatedAt!: Date;
}
