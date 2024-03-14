import type { Request } from "express";

import type { UserAuth } from "../entities/user/UserAuth";

export interface RequestAuth extends Request {
  user: UserAuth;
  token: string;
}
