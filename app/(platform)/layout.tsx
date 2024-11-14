import { ClerkProvider } from '@clerk/nextjs'

export default function Layout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl='/'>
      {children}
    </ClerkProvider>
  )
}