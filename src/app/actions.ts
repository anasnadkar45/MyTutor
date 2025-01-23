"use server"
import { requireUser } from "./utils/hooks";
import { z } from "zod";
import { AccountType, ServiceType } from "@prisma/client";
import prisma from "./utils/db";
import { redirect } from "next/navigation";

export type State = {
    status: "error" | "success" | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
};

const onboardingSchema = z.object({
    accountName: z
        .string()
        .min(1, { message: "Your preference is required" }),
    subjectIntrested: z
        .string()
        .min(3, { message: "Subject is required" }),
    experience: z
        .string()
        .min(3, { message: "Experience is required" }),
})

export async function onboardUser(prevState: any, formData: FormData) {
    const session = await requireUser()
    const user = session.user;

    if (!user?.id) {
        return {
            status: "error",
            message: "User not found. Please log in to add a new project."
        };
    }

    const validateFields = onboardingSchema.safeParse({
        accountName: formData.get('accountName'),
        subjectIntrested: formData.get('subjectIntrested'),
        experience: formData.get('experience'),
    });

    if (!validateFields.success) {
        return {
            status: "error",
            message: "Validation failed.",
            errors: validateFields.error.flatten().fieldErrors,
        };
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    })

    if (!currentUser?.onboardingComplete) {
        try {
            const data = await prisma.onboarding.create({
                data: {
                    accountName: validateFields.data.accountName as AccountType,
                    experience: validateFields.data.experience,
                    subjectIntrested: validateFields.data.subjectIntrested,
                    userId: user.id
                }
            })

            if (data) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        accountName: validateFields.data.accountName as AccountType,
                        onboardingComplete: true
                    }
                })
                return {
                    status: "success",
                    message: "You have been onboarded successfully."
                };
            }

            const state: State = {
                status: "success",
                message: "You have been onboarded successfully.",
            };
            return state;

        } catch (err) {
            return {
                status: "error",
                message: "An error occurred while creating the project. Please try again later."
            };
        }
    }
}

// ----------------------------------------------------------------

export async function getUserData() {
    const session = await requireUser();
    const data = await prisma.user.findUnique({
        where: {
            id: session.user?.id
        }
    })
    return data
}

// ----------------------------------------------------------------
const serviceSchema = z.object({
    serviceType: z
        .string()
        .min(1, { message: "Service Category is required" }),
    title: z
        .string()
        .min(3, { message: "Title is required" }),
    description: z
        .string()
        .min(3, { message: "Short description is required" }),
    price: z
        .number(),
    duration: z
        .number(),
})

export async function createService(prevState: any, formData: FormData) {
    const user = await getUserData();
    if (!user?.id) {
        return {
            status: "error",
            message: "User not found. Please log in to add a new project."
        };
    }

    const validateFields = serviceSchema.safeParse({
        serviceType: formData.get('serviceType'),
        title: formData.get('title'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        duration: Number(formData.get('duration')),
    });

    if (!validateFields.success) {
        return {
            status: "error",
            message: "Validation failed.",
            errors: validateFields.error.flatten().fieldErrors,
        };
    }

    if (user.accountName === "Tutor") {
        try {
            const data = await prisma.service.create({
                data: {
                    serviceType: validateFields.data.serviceType as ServiceType,
                    title: validateFields.data.title,
                    description: validateFields.data.description,
                    price: validateFields.data.price,
                    duration: validateFields.data.duration,
                    userId: user.id
                }
            })

            if (data) {
                return {
                    status: "success",
                    message: "Your service have been created successfully."
                };
            }

            const state: State = {
                status: "success",
                message: "Your service have been created successfully.",
            };
            return state;

        } catch (e) {
            return {
                status: "error",
                message: "An error occurred while creating the service. Please try again later."
            };
        }
    }
}

// ----------------------------------------------------------------

const timeSlotSchema = z.object({
    startTime: z
        .date(),
    endTime: z
        .date(),
})

export async function createTimeSlot(prevState: any, formData: FormData) {
    const user = await getUserData();
    if (!user?.id) {
        return {
            status: "error",
            message: "User not found. Please log in to add a new project."
        };
    }

    const validateFields = timeSlotSchema.safeParse({
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
    });

    if (!validateFields.success) {
        return {
            status: "error",
            message: "Validation failed.",
            errors: validateFields.error.flatten().fieldErrors,
        };
    }

    const serviceId = formData.get('serviceId') as string;
    if (user.accountName === "Tutor") {
        try {
            const data = await prisma.availableSlot.create({
                data: {
                    startTime: validateFields.data.startTime,
                    endTime: validateFields.data.endTime,
                    serviceId: serviceId,
                }
            })

            if (data) {
                return {
                    status: "success",
                    message: "Your time slot have been created successfully."
                };
            }

            const state: State = {
                status: "success",
                message: "Your time slot have been created successfully.",
            };
            return state;

        } catch (e) {
            return {
                status: "error",
                message: "An error occurred while creating the time slot. Please try again later."
            };
        }
    }
}