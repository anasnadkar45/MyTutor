"use client"
import type { BookingType } from "@/app/types/service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon } from "lucide-react"
import Link from "next/link"
import React from "react"

export const BookingCard = ({ booking }: { booking: BookingType }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{booking.Service?.title || "Untitled Service"}</h2>
                    <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Service Type</p>
                        <p className="font-medium">{booking.bookingType}</p>
                    </div>
                    {booking.Service && (
                        <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium">${booking.Service.price.toFixed(2)}</p>
                        </div>
                    )}
                </div>
                {booking.AvailableSlot && (
                    <>
                        <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <p>{formatDate(booking.AvailableSlot.startTime)}</p>
                        </div>
                        <div className="flex items-center">
                            <ClockIcon className="mr-2 h-4 w-4" />
                            <p>
                                {formatTime(booking.AvailableSlot.startTime)} - {formatTime(booking.AvailableSlot.endTime)}
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button asChild>
                    <Link href={`/learner/bookings/${booking.id}`}>Join Now</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

