import { getUserData } from '@/app/actions'
import { ServiceCard } from '@/app/components/learner/discover/service-card'
import prisma from '@/app/utils/db'
import { Topbar } from '@/components/global/Topbar'
import { Wrapper } from '@/components/global/Wrapper'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import EmptyScreen from '../../../../../public/Service.svg'

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
            <ServiceCard key={service.id} service={service as any} parentRoute={"tutor/service"} />
          ))}
        </div>
        {services.length === 0 && (
          <div className='h-[83vh] flex flex-col justify-center items-center gap-4'>
            <Image src={EmptyScreen} alt='EmptyScreen' width={200} height={200} className='bg-white p-4 rounded-lg'/>
            <h1>Guide your students right now, come on!</h1>
            <Link href={'/tutor/service/add'}>
              <Button>
                Try Here
              </Button>
            </Link>
          </div>
        )}
      </Wrapper>
    </>

  )
}

export default MyServices