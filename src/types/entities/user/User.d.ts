import type { BaseEntity } from "../BaseEntity";

export interface User extends BaseEntity {
  name: string;
  email: string;
  password: string;
}
