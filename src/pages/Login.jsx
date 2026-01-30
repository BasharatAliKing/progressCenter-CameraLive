import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/login";

const resolveExpiresAt = (data) => {
  const raw = data?.expiresAt ?? data?.expires_at ?? data?.tokenExpiresAt;
  if (raw) {
    const ts = new Date(raw).getTime();
    return Number.isNaN(ts) ? null : ts;
  }
  const seconds = data?.expiresIn ?? data?.expires_in ?? data?.tokenExpiresIn;
  if (typeof seconds === "number" && seconds > 0) {
    return Date.now() + seconds * 1000;
  }
  return null;
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Login failed.");
      }
      const token = data?.token || data?.accessToken || data?.data?.token;
      if (!token) {
        throw new Error("Token not found in response.");
      }
      const user = data?.user || data?.data?.user || data?.userData || data?.data || data;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      const expiresAt = resolveExpiresAt(data);
      if (expiresAt) {
        localStorage.setItem("auth_expires_at", String(expiresAt));
      } else {
        localStorage.removeItem("auth_expires_at");
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen overflow-hidden max-w-[100%]">
      <div
        className=" min-h-screen max-w-[100%] flex overflow-hidden container"
        style={{
          backgroundImage: "url('/nespak-house.jpg')",
        }}
      >
        <form
          className="flex bg-[#fff] flex-col gap-3 p-7 rounded-md my-auto md:w-1/2 ml-auto"
          onSubmit={handleSubmit}
        >
          <img className="h-15 w-22" src="/nespak-logo.png" alt="my-img" />
         <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-black">Sign in to your account</h1>
          <h3 className="text-sm text-secondary">Manage your projects and job sites.</h3>
         </div>
          <div className="flex text-secondary flex-col gap-1">
            <label htmlFor="name" className="font-medium text-sm">Email:</label>
            <input
              placeholder="Email or username"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="p-2 ring ring-gray-300 w-full rounded-md outline-none text-sm md:text-sm text-secondary font-medium"
              required
            />
          </div>
          <div className="flex text-gray-700 flex-col gap-1">
            <label htmlFor="name" className="font-medium text-sm">Password:</label>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="p-2 ring ring-gray-300 w-full rounded-md outline-none text-sm md:text-sm text-secondary font-medium"
              required
            />
          </div>
          <div className="flex text-sm text-secondary justify-between">
            <div className="flex gap-2 items-center font-medium">
                <input type="checkbox" className="outline-none border-none  accent-primary cursor-pointer h-4 w-4" /> Remember me
            </div>
            <Link className="font-medium duration-500 underline hover:text-primary">Forgot Password?</Link>
          </div>
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary p-2 rounded-md text-white font-medium outline-none border-none disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        <div className="flex items-center justify-center gap-2">
            <div className="h-[2px] w-full mt-1 bg-gray-300"></div>
            <h3 className="whitespace-nowrap text-secondary">Or sign in with</h3>
            <div className="h-[2px] w-full mt-1 bg-gray-300"></div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
