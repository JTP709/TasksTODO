import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-xl">Tasks TODO!</h1>
      <Link href="/signup">Click here to Sign Up</Link>
      <Link href="/login">Click here to Log In</Link>
    </>
  );
}
