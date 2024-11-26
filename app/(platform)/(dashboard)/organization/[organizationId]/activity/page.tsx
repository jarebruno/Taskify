import { Separator } from '@radix-ui/react-separator';
import { Info } from '../_components/info';

import { ActivityList } from './_components/activity-list';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className='w-full'>
      <Info />
      <Separator className='my-2'/>
      <Suspense fallback={<ActivityList.Skeleton/>}>
        <ActivityList />
      </Suspense>
    </div>
  )
}