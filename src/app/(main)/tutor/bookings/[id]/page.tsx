import prisma from '@/app/utils/db'
import React from 'react'
import { requireUser } from '@/app/utils/hooks';
import { getUserData } from '@/app/actions';
import { MyTutorVideo } from './video-player';

const getBookingData = async (bookingId: string) => {
    const data = await prisma.booking.findUnique({
        where: {
            id: bookingId
        },
    })
    return data;
}
const page = async ({ params }: { params: { id: string } }) => {
    const booking = await getBookingData(params.id)
    const session = await getUserData()
    return (
        <div>
            <div className="border rounded-lg p-2 h-[82vh]">
                <MyTutorVideo
                    booking={booking as any}
                    session={session as any}
                />
            </div>
        </div>
    )
}

export default page