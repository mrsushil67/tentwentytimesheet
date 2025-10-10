import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login({ email, password });
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem("token", result.user!.token);
        } else {
          sessionStorage.setItem("token", result.user!.token);
        }
        navigate("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen w-full justify-center">
      <div className="w-full max-w-7xl flex h-full">
        <div className="w-full sm:w-1/2 lg:w-1/2 flex flex-col justify-center px-6 py-8 sm:px-12 sm:py-12">
          <h2 className="text-2xl font-bold mb-6">Welcome back</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 p-2 bg-red-50 border border-red-300 rounded">
                {error}
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 px-4 rounded-lg transition ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
                }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center px-12 py-8">
          <h1 className="text-3xl font-bold mb-4">ticktock</h1>
          <p>
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any internet-connected
            device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;