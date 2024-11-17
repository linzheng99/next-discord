import { redirect } from 'next/navigation';

import { getProfile } from '@/features/auth/server/actions/profile';
import { getServer } from '@/features/services/queries';

export default async function SetUpPage() {
  const profile = await getProfile()

  const server = await getServer(profile.id)

  if (server) {
    redirect(`/servers/${server.id}`)
  }

  return <div>{JSON.stringify(profile)}</div>
}
