"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninPage() {
  const [isSignUp, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const supabase = createClient();
  const router = useRouter();

  async function handleAuth(event: React.SubmitEvent) {
    event.preventDefault();

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;
        setMessage("Check your email for the confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* 头部标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Personalized AI Newsletter
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {/* 表单部分 */}
        <form className="space-y-6" onSubmit={handleAuth}>
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-600">Message: {message}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </div>

          {/* 切换状态按钮 */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup((prev) => !prev)}
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
