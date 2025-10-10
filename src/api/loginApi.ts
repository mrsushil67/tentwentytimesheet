// src/api/loginApi.ts
interface User {
  email: string;
  password: string;
  token: string;
}

export const loginApi = async (email: string, password: string): Promise<User | undefined> => {
  const res = await fetch("http://localhost:5000/users");
  const users: User[] = await res.json();
  return users.find(u => u.email === email && u.password === password);
};
