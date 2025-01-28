"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CompletedTaskBtnProps {
  completed: boolean,
  id: string,
}

export default function CompletedTaskBtn({ completed, id }: CompletedTaskBtnProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleOnClick = async () => {
    setIsPending(true);
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ completed: !completed }),
      credentials: 'include',
    }).then(res => {
      if (!res.ok) alert("An error has occurred");
      else router.refresh();
    }).catch(err => {
      console.error(err);
      alert(err.message || "An error has occurred");
    }).finally(() => setIsPending(false));
  };

  return (
    <button className="flex items-center cursor-pointer" onClick={handleOnClick} disabled={isPending}>
      {completed
        ? <Image className="cursor-pointer" src="/checked.svg" alt="checked" width="24" height="24" />
        : <Image className="cursor-pointer" src="/unchecked.svg" alt="checked" width="24" height="24" />
      }
    </button>
  )
};
