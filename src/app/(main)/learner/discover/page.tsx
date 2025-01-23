import { ServiceCard } from '@/app/components/learner/discover/service-card';
import prisma from '@/app/utils/db';
import { Topbar } from '@/components/global/Topbar';
import { Wrapper } from '@/components/global/Wrapper';
import React from 'react'

const getServices = async () => {
    const data = await prisma.service.findMany({
        include:{
            User:{

            },
            availableSlots:{

            },
            Booking:{
                
            }
        }
    })
    return data
}
const page = async () => {
    const services = await getServices();
    console.log(services)
    return (
        <div>
            <Topbar>
                <h1>Discover Services</h1>
            </Topbar>
            <Wrapper>
                <div className='grid md:grid-cols-3 gap-2'>
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service as any} parentRoute={"learner/discover"}/>
                    ))}
                </div>
            </Wrapper>
        </div>
    )
}

export default page