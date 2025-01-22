"use server"
import { requireUser } from "./utils/hooks";
import { z } from "zod";
import { AccountType } from "@prisma/client";
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

export async function getUserData(){
    const session = await requireUser();
    const data = await prisma.user.findUnique({
        where:{
            id:session.user?.id
        }
    })
    return data
}