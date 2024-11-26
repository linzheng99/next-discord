export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full">
      {children}
    </main>
  )
}
