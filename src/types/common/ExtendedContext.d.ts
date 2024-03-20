import { Context } from "elysia";

export interface ExtendedContext extends Context {
  jwt: any;
  cookie: Record<string, any>;
  setCookie: any;
  removeCookie: any;
  user: any;
}
