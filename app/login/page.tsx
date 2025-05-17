"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Image from 'next/image';

const Login: React.FC = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Email || !Password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, Password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push(`/dashboard?id=${encodeURIComponent(result.userId)}`);
        }, 1500);
      } else {
        toast.error(result.message || "Login failed!");
      }
    } catch (error) {
      toast.error("An error occurred while logging in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white bg-center relative p-4">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/wallpaper.png')" }}></div>
      <ToastContainer className="text-xs" />
      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-xl text-center text-black">
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="6+ Characters, 1 Capital letter"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full text-xs py-3 bg-[#2563EB] text-white font-medium rounded-md hover:bg-blue-700 shadow-lg"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
          <div className="text-center text-xs">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>
        </form>
        <footer className="mt-4 text-center text-xs">
          <p>Axxet Flow - PHDev-Tech Solutions</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;