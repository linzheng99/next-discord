export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  )
}
