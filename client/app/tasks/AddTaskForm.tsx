"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddTask() {
  const [task, setTask] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.currentTarget.value);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ title: task }),
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        alert('An error has occurred while creating your new task');
      } else {
        setTask("");
        router.refresh();
      }
    }).catch(err => {
      console.error(err);
      alert('An error has occurred while creating your new task');
    }).finally(() => setIsPending(false));
  };

  return (
    <>
      <h2 className="font-semibold">Add a new Task</h2>
      <form className="flex flex-col" onSubmit={handleOnSubmit}>
        <label className="flex flex-col">
          New Task:
          <input 
            type="text"
            className="text-black"
            onChange={handleOnChange}
            value={task}
          />
        </label>
        <button
          className="mt-2 p-2 border-gray-500 border-2"
          disabled={isPending}
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  )
};
