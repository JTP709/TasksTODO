import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  console.log('>> token from cookies: ', { token })

  const tasks = await fetch('http://localhost:4000/api/tasks', {
    method: "GET",
    headers: new Headers({ Authorization: `Bearer ${token}`}),
    credentials: 'include',
  }).then(res => {
    console.log({ res, status: res.status });
    if (res.status === 401) redirect("/login");
    return res.json()
  });

  return (
    <>
      <h1>Your Tasks</h1>
      <ul>
        {tasks?.map((task: Task) => {
          <li key={task.id}>{ task.title }</li>
        })}
      </ul>
    </>
  )
};
