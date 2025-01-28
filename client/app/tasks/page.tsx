import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddTask from "./AddTaskForm";
import CompletedTaskBtn from "./CompletedTaskBtn";
import TaskInput from "./TaskInput";
import DeleteTaskBtn from "./DeleteTaskBtn";

export default async function TasksPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  const tasks = await fetch('http://localhost:4000/api/tasks', {
    method: "GET",
    headers: new Headers({ Authorization: `Bearer ${token}`}),
    credentials: 'include',
  }).then(res => {
    if (res.status === 401) redirect("/login");
    return res.json()
  });

  return (
    <>
      <h1 className="font-bold text-xl">Your Tasks</h1>
      <ul className="w-full">
        {tasks?.map((task: Task) => (
          <li 
            className="flex flex-row w-full justify-between"
            key={task.id}
          >
            <TaskInput id={task.id} title={task.title} />
            <CompletedTaskBtn id={task.id} completed={task.completed} />
            <DeleteTaskBtn id={task.id} />
          </li>
        ))}
      </ul>
      <AddTask />
    </>
  )
};
