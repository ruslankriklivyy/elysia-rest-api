import UserService from "@/services/UserService";
import TokenService from "@/services/TokenService";
import { SignUpPayload } from "@/types/entities/auth/SignUpPayload";
import { SignInPayload } from "@/types/entities/auth/SignInPayload";
import AuthService from "@/services/AuthService";
import { ExtendedContext } from "@/types/common/ExtendedContext";

class AuthController {
  signUp = async ({ body, jwt, setCookie }: ExtendedContext) => {
    try {
      const { name, email, password } = body as SignUpPayload;
      const newUser = await UserService.create({
        data: {
          name,
          password,
          email,
        },
      });

      const jwtAccessToken = jwt.sign(
        {
          data: {
            id: newUser.id,
            email: newUser.email,
            password: newUser.password,
          },
        },
        process.env.JWT_SECRET || "test",
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h", algorithm: "HS256" }
      );

      await TokenService.create({
        userId: newUser.id,
        jwtAccessToken,
      });

      setCookie("access_token", jwtAccessToken, {
        maxAge: 60 * 60,
        path: "/",
      });

      return { user: newUser, access_token: jwtAccessToken };
    } catch (error) {
      console.log(error);
    }
  };

  signIn = async ({ body, jwt, setCookie }: ExtendedContext) => {
    try {
      const { email, password } = body as SignInPayload;

      const user = await UserService.findOne({ email });

      if (!user) throw Error("User not found");

      const jwtAccessToken = await jwt.sign(
        {
          data: {
            id: user.id,
            email: user.email,
            password: user.password,
          },
        },
        process.env.JWT_SECRET || "test",
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h", algorithm: "HS256" }
      );

      setCookie("access_token", jwtAccessToken, {
        maxAge: 60 * 60,
        path: "/",
      });

      return await AuthService.signIn({
        user,
        password,
        jwtAccessToken,
      });
    } catch (error) {
      console.log(error);
    }
  };

  logout = async ({ cookie, removeCookie }: ExtendedContext) => {
    try {
      console.log("cookie", cookie);
      await AuthService.logout(cookie.access_token);
      removeCookie("access_token");
    } catch (error) {
      console.log(error);
    }
  };
}

export default new AuthController();