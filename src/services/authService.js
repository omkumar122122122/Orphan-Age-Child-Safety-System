import { users } from "../data/dummyData";

export async function fakeLogin({ email, password }) {
  await new Promise((resolve) => setTimeout(resolve, 550));
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
}
