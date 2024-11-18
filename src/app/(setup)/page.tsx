import { redirect } from 'next/navigation';

import { getProfile } from '@/features/auth/actions/profile';
import { getFirstServer } from '@/features/services/queries';

export default async function SetUpPage() {
  const profile = await getProfile()

  const server = await getFirstServer(profile.id)

  if (server) {
    redirect(`/servers/${server.id}`)
  }

  return <div>{JSON.stringify(profile)}</div>
}
