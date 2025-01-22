import { redirect } from "next/navigation";
import { requireUser } from "./utils/hooks";

export default async function Home() {
  const session = await requireUser()
  if (session.user) {
    redirect('/dashboard')
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    </main>
  );
}
