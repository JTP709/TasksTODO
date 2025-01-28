import LogoutBtn from "./LogoutBtn";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full flex justify-end">
        <LogoutBtn />
      </div>
      { children }
    </>
  )
};
