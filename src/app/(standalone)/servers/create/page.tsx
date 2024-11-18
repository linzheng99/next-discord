import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import CreateServerForm from "@/features/servers/components/create-server-form";

export const dynamic = "force-dynamic";

export default async function CreateServerPage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return (
    <div className="w-full lg:max-w-xl">
      <CreateServerForm />
    </div>
  )
}
