import { redirect } from 'next/navigation';

import { getProfile } from '@/features/auth/actions/profile';
import CreateServerForm from '@/features/servers/components/create-server-form';
import { getFirstServer } from '@/features/servers/queries';

export default async function SetUpPage() {
  const profile = await getProfile()

  const server = await getFirstServer(profile.id)

  if (server) {
    redirect(`/servers/${server.id}`)
  }

  return <CreateServerForm />
}
