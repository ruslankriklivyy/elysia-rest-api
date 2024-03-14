import jwt from "jsonwebtoken";

import { User } from "@/types/entities/user/User";

interface VerifyJWTTokenResult {
  data: User;
}

export default function verifyJWTToken(
  token: string
): Promise<VerifyJWTTokenResult> {
  return new Promise((resolve, reject) => {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "test");

    if (!decodedData) return reject("Token is not decoded");

    resolve(decodedData as VerifyJWTTokenResult);
  });
}
