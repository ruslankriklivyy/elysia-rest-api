import { omit } from "lodash";

import UserService from "@/services/UserService";
import { ExtendedContext } from "@/types/common/ExtendedContext";

class UserController {
  findAll = async ({ set }: ExtendedContext) => {
    try {
      return await UserService.findAll();
    } catch (error) {
      set.status = 500;
      throw Error("Users not found");
    }
  };

  findOne = async ({ set, params }: ExtendedContext) => {
    try {
      const userId = +params["id"];
      const user = await UserService.findOne({ userId });
      return omit(user, "password");
    } catch (error) {
      set.status = 500;
      throw Error("User not found");
    }
  };

  currentUser = async ({ set, user }: ExtendedContext) => {
    try {
      if (!user) throw Error("User not found");
      const currentUser = await UserService.findOne({ userId: user.id });
      return omit(currentUser, "password");
    } catch (error) {
      console.log(error);
      set.status = 500;
    }
  };
}

export default new UserController();
