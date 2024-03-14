import { Context } from "elysia";

export interface ExtendedContext extends Context {
  jwt: any;
  cookie: Record<string, string>;
  setCookie: any;
  removeCookie: any;
  user: any;
}
