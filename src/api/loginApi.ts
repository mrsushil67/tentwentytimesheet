// src/api/loginApi.ts
interface User {
  email: string;
  password: string;
  token: string;
}

export const loginApi = async (email: string, password: string): Promise<User | undefined> => {
  const res = await fetch("https://tentwentyapi.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  console.log(res);

  if (!res.ok) {
    console.error("Login failed");
    return undefined;
  }

  const user: User = await res.json();
  return user;
};

