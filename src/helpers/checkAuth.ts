import jwt from "jsonwebtoken";

import UserService from "@/services/UserService";
import TokenService from "@/services/TokenService";

export const checkAuth = async (accessToken: string) => {
  try {
    const jwtData = jwt.verify(accessToken, process.env.JWT_SECRET || "test", {
      algorithms: ["HS256"],
    });
    const userJWT = (jwtData as any).data;

    if (!userJWT) {
      throw new Error("Auth failure");
    }

    const user = await UserService.findOne({ email: userJWT.email });

    if (!user || !accessToken) {
      throw new Error("Auth failure");
    }

    const token = await TokenService.findOne({ accessToken });

    if (!token) {
      throw new Error("Auth failure");
    }

    return {
      user,
    };
  } catch (error) {
    throw new Error("Auth failure");
  }
};
