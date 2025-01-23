"use client"
import { createService } from '@/app/actions'
import { SubmitButton } from '@/components/global/SubmitButton'
import { Topbar } from '@/components/global/Topbar'
import { Wrapper } from '@/components/global/Wrapper'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ServiceType } from '@prisma/client'
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

const page = () => {
    const initialState = { message: "", status: undefined, errors: {} }
    const [state, formAction] = useActionState(createService, initialState);
    const [serviceType, setServiceType] = useState<ServiceType>();
    useEffect(() => {
        console.log("State updated:", state)
        if (state?.status === "success") {
            toast.success(state.message)
            return redirect('/tutor/service')
        } else if (state?.status === "error") {
            toast.error(state.message)
        }
    }, [state]);
    const ServiceCategory = [
        {
            id: 'Call',
            icon: <Phone className="h-6 w-6" />,
            title: '1:1 Call',
            description: 'Conduct 1:1 video sessions'
        },
        {
            id: 'message',
            icon: <Mail className="h-6 w-6" />,
            title: 'Priority DM',
            description: 'Setup your priority inbox'
        },
    ];
    return (
        <div>
            <Topbar>
                <Link href={'/tutor/service'}>
                    <ArrowLeft />
                </Link>
                <h1 className=''>What are you creating today?</h1>
            </Topbar>
            <Wrapper className="grid md:grid-cols-2">
                <form action={formAction} className='space-y-6'>
                    <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-left text-lg font-bold">
                            Select Service
                        </Label>
                        <Input type='hidden' name="serviceType" value={serviceType} />
                        <div className='flex gap-2'>
                            {ServiceCategory.map((category) => (
                                <Card
                                    key={category.id}
                                    onClick={() => setServiceType(category.id as ServiceType)}
                                    className={`cursor-pointer border-2 transition-all hover:bg-secondary ${serviceType === category.id ? "border-green-500 bg-secondary" : "bg-card"}`}
                                >
                                    <CardHeader>
                                        <CardTitle className={cn('space-y-2', serviceType === category.id ? "text-primary" : "")}>
                                            {category.icon}
                                            <h1>{category.title}</h1>
                                        </CardTitle>
                                        <CardDescription>
                                            {category.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                        {state?.errors?.serviceType && (
                            <p className="text-destructive">{state.errors.serviceType}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-left text-lg font-bold">
                            Title
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Learn Basic of English"
                            className="w-full"
                        />
                        {state?.errors?.title && (
                            <p className="text-destructive">{state.errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-left text-lg font-bold">
                            Description
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="I will teach the basic foundation of English language"
                            className="w-full"
                        />
                        {state?.errors?.description && (
                            <p className="text-destructive">{state.errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-left text-lg font-bold">
                            Price
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 border-0">
                                <span className="text-muted-foreground sm:text-sm">₹</span>
                            </div>
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                className="pl-7"
                                placeholder="0"
                                min="0"
                                step="1"
                            />
                        </div>
                        {state?.errors?.price && (
                            <p className="text-destructive">{state.errors.price}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration" className="text-left text-lg font-bold">
                            Duration (mins)
                        </Label>
                        <Input
                            id="duration"
                            name="duration"
                            type='number'
                            placeholder="60 Minutes"
                            className="w-full"
                        />
                        {state?.errors?.duration && (
                            <p className="text-destructive">{state.errors.duration}</p>
                        )}
                    </div>
                    <SubmitButton text='Create Now' className='w-full' />
                </form>
                <div></div>
            </Wrapper>
        </div>
    )
}

export default page