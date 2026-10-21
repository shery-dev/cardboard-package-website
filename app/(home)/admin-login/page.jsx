"use client";

import { useState } from "react";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    setLoading(true);
    fetch("/api/v1/admin-login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          window.location.href = "/admin";
        } else {
          setError(data.message || "Invalid email or password.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Something went wrong. Try again.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="p-4 text-center border-b border-gray-200">
          <Image src="/img/logo.svg" alt="Logo" width={48} height={48} className="mx-auto mb-2" />
          <h1 className="text-xl font-semibold text-headingTxtColor">Admin Panel Login</h1>
          <p className="text-sm text-gray-500">Sign in with your admin credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {error && (
            <Alert color="failure" icon={HiInformationCircle}>
              {error}
            </Alert>
          )}
          <div>
            <Label htmlFor="admin-email" value="Email" />
            <TextInput
              id="admin-email"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-password" value="Password" />
            <TextInput
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-mainBgColor hover:bg-mainBgHover text-white"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
