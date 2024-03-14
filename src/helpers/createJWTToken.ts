import jwt from "jsonwebtoken";

interface CreateJWTTokenPayload {
  id: number;
  email: string;
  password: string;
}

export default function createJWTToken({
  id,
  email,
  password,
}: CreateJWTTokenPayload) {
  return jwt.sign(
    {
      data: {
        id,
        email,
        password,
      },
    },
    process.env.JWT_SECRET || "test",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h", algorithm: "HS256" }
  );
}
