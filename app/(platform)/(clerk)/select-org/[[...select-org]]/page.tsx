import { OrganizationList } from '@clerk/nextjs'

export default function Page( ) {
  return (
    <OrganizationList 
      hidePersonal
      afterCreateOrganizationUrl='/organization/:id'
      afterSelectOrganizationUrl='/organization/:id'
    />
  )
}