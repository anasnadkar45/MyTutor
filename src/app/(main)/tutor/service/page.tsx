import { getUserData } from '@/app/actions'
import { ServiceCard } from '@/app/components/learner/discover/service-card'
import prisma from '@/app/utils/db'
import { Topbar } from '@/components/global/Topbar'
import { Wrapper } from '@/components/global/Wrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const getServices = async (userId: string) => {
  const data = await prisma.service.findMany({
    where: {
      userId: userId
    },
    include: {
      User: {

      },
      availableSlots: {

      },
      Booking: {

      }
    }
  })
  return data
}
const MyServices = async () => {
  const user = await getUserData()
  const services = await getServices(user?.id as string);
  console.log(services)
  return (
    <>
      <Topbar className='justify-between'>
        <h1 className='text-2xl'>My Services</h1>
        <Link href={'/tutor/service/add'}>
          <Button>Create Service</Button>
        </Link>
      </Topbar>
      <Wrapper>
        <div className='grid md:grid-cols-3 gap-2'>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service as any} parentRoute={"tutor/service"}/>
          ))}
        </div>
      </Wrapper>
    </>

  )
}

export default MyServices