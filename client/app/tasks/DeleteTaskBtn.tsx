"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteTaskBtnProps {
  id: string;
}

export default function DeleteTaskBtn({ id }: DeleteTaskBtnProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleOnClick = async () => {
    setIsPending(true);
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      credentials: 'include',
    }).then(res => {
      if (!res.ok) alert("An error has occurred");
      else router.refresh();
    }).catch(err => {
      console.error(err);
      alert("An error has occurred");
    }).finally(() => setIsPending(false));
  };

  return (
    <button onClick={handleOnClick} disabled={isPending}>
      <Image src="/trashcan.svg" alt="delete task" width="24" height="24" />
    </button>
  );
};
