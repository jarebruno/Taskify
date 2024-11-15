import { Navbar } from './_components/navbar';

export default function Layout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-full'>
      <Navbar />
      {children}
    </div>
  )
}