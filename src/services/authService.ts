import { loginApi } from "../api/loginApi";

interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  token: string;
  email: string;
  [key: string]: any;
}

interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}

export const login = async ({ email, password }: LoginPayload): Promise<LoginResult> => {
  const user = await loginApi(email, password);
  if (user) {
    sessionStorage.setItem("token", user.token);
    return { success: true, user };
  }
  return { success: false, message: "Invalid credentials" };
};
