"use client"

import type React from "react"
import { useState } from "react"
import type { BookingType } from "@/app/types/service"
import { BookingCard } from "@/app/components/learner/bookings/BookingCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BookingCategoriesProps {
  bookings: BookingType[]
}

export const BookingCategories: React.FC<BookingCategoriesProps> = ({ bookings }) => {
  const [activeTab, setActiveTab] = useState("all")

  const categories = [
    { id: "all", label: "All Bookings" },
    { id: "Upcomming", label: "Upcomming" },
    { id: "Completed", label: "Completed" },
  ]

  const filteredBookings = (category: string) => {
    if (category === "all") return bookings
    return bookings.filter((booking) => booking.status === category)
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          <div className="grid md:grid-cols-3 gap-4">
            {filteredBookings(category.id).map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
          {filteredBookings(category.id).length === 0 && (
            <p className="text-center text-muted-foreground mt-4">
              No {category.id === "all" ? "" : category.label.toLowerCase()} bookings found.
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

