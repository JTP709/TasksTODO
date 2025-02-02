"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutBtn() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);

    await fetch('/api/auth/logout', {
      method: "POST",
      credentials: 'include',
    }).then(res => {
      if (!res.ok) alert('An error has occurred');
      else router.push('/login');
    }).catch(err => {
      console.error(err);
      alert(err.message || 'An error has occurred');
    }).finally(() => setIsPending(false));
  };

  return (
    <button onClick={handleLogout} disabled={isPending}>
      <Image src="/logout.svg" alt="log out" width="24" height="24" />
    </button>
  )
};
