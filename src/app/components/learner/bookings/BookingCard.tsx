"use client"
import { BookingType } from '@/app/types/service'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import React from 'react'

export const BookingCard = ({ booking }: { booking: BookingType }) => {
    console.log(booking)
    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    <h1>{booking.service?.description}</h1>
                </CardTitle>
            </CardHeader>
            <CardFooter>
                <Button onClick={()=>redirect(`/learner/bookings/${booking.id}`)}>Join Now</Button>
            </CardFooter>
        </Card>
    )
}
