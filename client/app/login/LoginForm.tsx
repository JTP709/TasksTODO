"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage("");

    await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ username, password }),
    }).then(res => {
      if (!res.ok) setMessage("An error has occurred");
      else return res.json()
    }).then(res => localStorage.setItem("token", res.data.token))
      .then(() => router.push("/tasks"))
      .catch(err => {
        console.error(err);
        setMessage(err.response.data.message || "An error has occurred");
      });
  };

  const handleUsernameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handlePasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <label>
        Username:
        <input
          required
          type="text"
          value={username}
          onChange={handleUsernameOnChange}
        />
      </label>
      <label>
        Password:
        <input
          required
          type="text"
          value={password}
          onChange={handlePasswordOnChange}
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
      >
        Login
      </button>
      { message && <p>{ message }</p>}
    </form>
  )
};
