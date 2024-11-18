import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import db from '@/lib/db';

export async function getProfile() {
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
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  })

  return newProfile
}
