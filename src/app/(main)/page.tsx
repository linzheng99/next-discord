import { redirect } from 'next/navigation';

import { getProfile } from '@/features/auth/actions/profile';
import { getServers } from '@/features/servers/queries';

export default async function SetUpPage() {
  const profile = await getProfile()

  const servers = await getServers(profile.id)

  if (servers.length) {
    redirect(`/servers/${servers[0].id}`)
  } else {
    redirect('/servers/create')
  }

}
