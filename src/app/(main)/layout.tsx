import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import MembersModal from "@/features/members/components/members-modal";
import CreateChannelServerModal from "@/features/servers/components/create-channel-server-modal";
import CreateServerModel from '@/features/servers/components/create-server-modal'
import EditServerModal from "@/features/servers/components/edit-server-modal";
import InviteCodeServerModal from "@/features/servers/components/invite-code-server-modal";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-full">
      <CreateServerModel />
      <EditServerModal />
      <InviteCodeServerModal />
      <MembersModal />
      <CreateChannelServerModal />
      <div className="flex h-full">
        <div className="hidden md:!flex w-[72px] z-30 flex-col fixed inset-y-0">
          <NavigationSidebar />
        </div>
        <main className="h-full md:pl-[72px] flex-1">{children}</main>
      </div>
    </div>
  )
}
