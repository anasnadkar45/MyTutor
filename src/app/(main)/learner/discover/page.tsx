import prisma from "@/app/utils/db"
import { Topbar } from "@/components/global/Topbar"
import { Wrapper } from "@/components/global/Wrapper"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import EmptyScreen from "../../../../../public/Service.svg"
import { ServicesPagination } from "@/app/components/learner/discover/ServicesPagination"

export const getServices = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize
  const [services, totalCount] = await Promise.all([
    prisma.service.findMany({
      include: {
        User: true,
        availableSlots: true,
        Booking: true,
      },
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.service.count(),
  ])

  return { services, totalCount }
}

export default async function DiscoverPage({ searchParams }: { searchParams: { page: string } }) {
  const page = Number(searchParams.page) || 1
  const pageSize = 9
  const { services, totalCount } = await getServices(page, pageSize)

  return (
    <div>
      <Topbar>
        <h1>Discover Services</h1>
      </Topbar>
      <Wrapper>
        {services.length > 0 ? (
          <ServicesPagination services={services as any} totalCount={totalCount} pageSize={pageSize} currentPage={page} />
        ) : (
          <div className="h-[83vh] flex flex-col justify-center items-center gap-4">
            <Image
              src={EmptyScreen || "/placeholder.svg"}
              alt="EmptyScreen"
              width={200}
              height={200}
              className="bg-white p-4 rounded-lg"
            />
            <h1>Guide your students right now, come on!</h1>
            <Link href={"/tutor/service/add"}>
              <Button>Try Here</Button>
            </Link>
          </div>
        )}
      </Wrapper>
    </div>
  )
}

