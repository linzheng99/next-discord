
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-neutral-100 h-full flex items-center justify-center">
      {children}
    </main>
  );
}
