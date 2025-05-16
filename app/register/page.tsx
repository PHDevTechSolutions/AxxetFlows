"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [userName, setuserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !Email || !Password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, Email, Password, Role }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        toast.error(result.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("An error occurred while registering!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white bg-center relative p-4">
      <ToastContainer className="text-xs" />
      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-xl text-center text-black">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize" placeholder="Enter your Username" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your Email" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <select id="Role" value={Role} onChange={(e) => setRole(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="6+ Characters, 1 Capital letter" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <button type="submit" className="w-full text-xs py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-lg">Create Account</button>
          </div>
        </form>
        <div className="text-center text-xs">
          Already have a account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </div>
        <footer className="mt-4 text-center text-xs">
          <p>AxxetFlow - PHDev-Tech Solutions</p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
