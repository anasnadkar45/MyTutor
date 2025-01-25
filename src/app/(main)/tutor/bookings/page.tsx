import { getUserData } from '@/app/actions'
import { BookingCard } from '@/app/components/tutor/bookings/BookingCard'
import prisma from '@/app/utils/db'
import { Topbar } from '@/components/global/Topbar'
import { Wrapper } from '@/components/global/Wrapper'
import React from 'react'

const getBookings = async (userId: string) => {
    const data = await prisma.service.findMany({
        where: {
            userId: userId,
        },
        include: {
            Booking: true
        }
    })
    return data
}

const page = async () => {
    const user = await getUserData()
    const bookings = await getBookings(user?.id as string)
    console.log(bookings)
    return (
        <div>
            <Topbar className='justify-between'>
                <h1>Lets see which bookings we have today!</h1>
                {/* <Link href={'/tutor/discover'}>
                    <Button>Find Tutors</Button>
                </Link> */}
            </Topbar>
            <Wrapper>
                <div className='grid md:grid-cols-3 gap-2'>
                    {bookings.map((booking) => (
                        booking.Booking.map((booking) => (
                            <BookingCard key={booking.id} booking={booking as any} />
                        ))
                    ))}
                </div>
            </Wrapper>
        </div>
    )
}

export default page