"use client";

import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/Context";

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState(false)

  const { setIsLogIn } = useAppContext();

  const handleSignIn = () => {
    if (name && email && password) {
      fetch("/api/v1/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        }),
      }).then(async (res) => {
        if (res.ok) {
          setError("")
          setName("")
          setEmail("")
          setPassword("")
          setMsg(true)
          setIsLogIn(true)
          setTimeout(() => {
            setMsg(false)
            router.push("/user-auth")
          }, 3000);
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
          <span className="font-medium">Success!</span> Account created!
        </Alert>
      }
      <form className="flex flex-col gap-2">
        <div>
          <div className=" mb-1 block">
            <Label htmlFor="userName" value="Your name" />
          </div>
          <TextInput
            id="userName"
            type="text"
            placeholder="John Smith"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-1 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="name@mail.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
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
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-500">
          <Link href={'/user-auth'}>
            Already have an account?
          </Link>
        </div>
        <Button
          onClick={handleSignIn}
          className="w-full border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover"
        >
          Submit
        </Button>
      </form>
    </Card>
  );
}
