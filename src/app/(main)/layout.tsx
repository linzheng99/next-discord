import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import CreateServerModel from '@/features/servers/components/create-server-modal'
import InviteCodeServerModal from "@/features/servers/components/invite-code-server-modal";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-full">
      <CreateServerModel />
      <InviteCodeServerModal />
      <div className="flex h-full">
        <div className="hidden md:!flex w-[72px] z-30 flex-col fixed inset-y-0">
          <NavigationSidebar />
        </div>
        <main className="h-full md:pl-[72px] flex-1">{children}</main>
      </div>
    </div>
  )
}
