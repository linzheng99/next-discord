import NavigationSidebar from "@/components/navigation/navigation-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-full md:w-[72px] bg-[#2b2b37] flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="h-full md:pl-[72px]">{children}</main>
    </div>
  )
}
