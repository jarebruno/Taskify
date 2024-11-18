'use client'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import { useOrganization, useOrganizationList} from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Accordion } from '@/components/ui/accordion'
import { NavItem, Organization } from './navitem'

interface Props {
  storageKey?: string
}

export function Sidebar ({ storageKey = 't-sidebar-state' }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {})
  const { organization: activeOrganization, isLoaded: isOrgLoaded } = useOrganization()
  const { userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true
    }
  })

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key: string) => {
    if(expanded[key]) acc.push(key)
    return acc
  }, [])

  const onExpand = (id: string) => {
    setExpanded((curr) => {
      return {
        ...curr,
        [id]: !expanded[id]
      }
    })
  }

  if(!isOrgLoaded || !isOrgListLoaded || userMemberships.isLoading) {
    return <Skeleton />
  }

  return (
    <>
      <div className='font-medium text-xs flex items-center mb-1'>
        <span className='pl-4'>
          Workspaces
        </span>
        <Button type='button' size='icon' variant='ghost' className='ml-auto' asChild>
          <Link href='/select-org'>
            <Plus className='h-4 w-4'/>
          </Link>
        </Button>
      </div>
      <Accordion type='multiple' defaultValue={defaultAccordionValue} className='space-y-2'>
        {
          userMemberships.data.map(({ organization }) => {
            return (
              <p key={organization.id}>
                <NavItem
                  key={organization.id}
                  isActive={activeOrganization?.id === organization.id}
                  isExpanded={expanded[organization.id]}
                  organization={organization as Organization}
                  onExpand={onExpand}
                />
              </p>
            )
          })
        }
      </Accordion>
    </>
  )
}