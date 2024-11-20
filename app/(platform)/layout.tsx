import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

export default function Layout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl='/'>
      <Toaster />
      {children}
    </ClerkProvider>
  )
}