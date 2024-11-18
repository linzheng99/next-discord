import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { getCurrentProfile } from "@/features/auth/queries";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile()

  if (!profile) return null

  return (
    <div className="h-full">
      <div className="h-full w-full md:w-[72px] dark:bg-[#2b2b37] bg-[#e5e5e5] flex-col fixed inset-y-0">
        <NavigationSidebar profileId={profile.id} />
      </div>
      <main className="h-full md:pl-[72px]">{children}</main>
    </div>
  )
}
