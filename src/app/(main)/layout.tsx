import NavigationSidebar from "@/components/navigation/navigation-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="hidden fixed left-0 top-0 md:block md:w-[72px] h-full overflow-y-auto">
          <NavigationSidebar />
        </div>
        <main className="h-full md:pl-[72px]">{children}</main>
      </div>
    </div>
  )
}
