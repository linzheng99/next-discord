
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-neutral-100 min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
}
