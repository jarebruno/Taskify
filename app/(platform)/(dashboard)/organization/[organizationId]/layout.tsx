import { startCase } from 'lodash'
import { OrgControl } from './_components/org-control';
import { auth } from '@clerk/nextjs/server';

export async function generateMetadata () {
  const { orgSlug } = await auth()
  return {
    title: startCase(orgSlug || 'Organization')
  }
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  )
}