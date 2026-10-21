"use client";

import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/context/Context";

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState(false)

  const { setIsLogIn } = useAppContext();

  const handleLogIn = () => {
    if (email && password) {
      fetch("/api/v1/log-in", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setError("")
          setEmail("")
          setPassword("")
          setMsg(true)
          setIsLogIn(true)
          setTimeout(() => {
            setMsg(false)
            window.location.href = "/"
          }, 800);
        } else {
          const error = await res.json();
          setError(error.message);
          setTimeout(() => {
            setError("")
          }, 3000);
        }
      })
    } else {
      setError("Please fill the all data!")
      setTimeout(() => {
        setError("")
      }, 3000);
    }
  }
  return (
    <Card
      className="w-full md:w-1/2"
      renderImage={() => (
        <Image
          className="h-44 w-full rounded-t-lg object-cover"
          width={500} height={500} src="/img/office-desktop-with-laptop.jpg" alt="image 1" />
      )}
    >
      {error &&
        <Alert
          color="failure"
          icon={HiInformationCircle}
        >
          <span className="font-medium">Info alert!</span> {error}
        </Alert>
      }
      {msg &&
        <Alert color="success" icon={HiInformationCircle}>
          <span className="font-medium">Success!</span> Signed in successfully!
        </Alert>
      }
      <form className="flex flex-col gap-2">
        <div>
          <div className="mb-1 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="name@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="mb-1 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            id="password1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          Do not have an account?
          <Link href={'/register'} className=" text-gray-700 hover:text-blue-500">
            Register!
          </Link>
        </div>
        <Button
          onClick={handleLogIn}
          className=" w-full border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover "
        >
          Submit
        </Button>
      </form>
    </Card>
  );
}
