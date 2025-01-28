"use client";

import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TaskInputProps {
  title: string;
  id: string;
}

export default function TaskInput({ title, id }: TaskInputProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const updateTask = debounce(async (value: string) => {
    setIsPending(true);
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ title:value }),
      credentials: 'include',
    }).then(res => {
      if (!res.ok) alert('An error has occurred');
      else router.refresh();
    }).catch(err => {
      console.error(err);
      alert(err.message || "An error has occurred");
    }).finally(() => setIsPending(false));
  }, 1000);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => updateTask(e.currentTarget.value);

  return (
    <input
      className="text-black mr-8"
      aria-label="edit your task" 
      type="text"
      defaultValue={title}
      onChange={handleOnChange}
      disabled={isPending}
    />
  )
};
