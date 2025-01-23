import prisma from '@/app/utils/db'
import { Topbar } from '@/components/global/Topbar'
import { Wrapper } from '@/components/global/Wrapper'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const getServiceData = async (serviceId: string) => {
    const data = await prisma.service.findUnique({
        where: {
            id: serviceId
        }
    })
    return data;
}

const page = async ({ params }: { params: { id: string } }) => {
    const service = await getServiceData(params.id);
    return (
        <div>
            <Topbar className='flex justify-between text-foreground'>
                <div className='flex items-center gap-6 text-muted-foreground'>
                    <Link href={'/learner/discover'} className='hover:text-foreground'>
                        <ArrowLeft />
                    </Link>
                    <h1>{service?.title}</h1>
                </div>
                <Button>Book Now</Button>
            </Topbar>
            <Wrapper>
                <div></div>
            </Wrapper>
        </div>
    )
}

export default page