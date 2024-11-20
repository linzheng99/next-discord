import { redirect } from 'next/navigation';

import { getCurrent } from '@/lib/current-profile';
import db from '@/lib/db';

export async function getOrCreateProfile() {
  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (profile) {
    return profile
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.emailAddresses[0].emailAddress ?? '',
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  })

  return newProfile
}
