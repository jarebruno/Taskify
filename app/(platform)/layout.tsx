import { ModalProvider } from '@/components/providers/modal-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

export default function Layout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl='/'>
      <QueryProvider>
        <Toaster />
        <ModalProvider/>
        {children}
      </QueryProvider>
    </ClerkProvider>
  )
}