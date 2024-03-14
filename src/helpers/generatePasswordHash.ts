export default async function generatePasswordHash(password: string) {
  return Bun.password.hash(password, {
    algorithm: "bcrypt",
  });
}
