import React from 'react'
import {Onboarding} from '../component/onboarding/Onboarding'
import { requireUser } from '../utils/hooks'
import prisma from '../utils/db'
import { redirect } from 'next/navigation'

const getUserData = async(userId: string) =>{
  const data = await prisma.user.findUnique({
    where:{
      id: userId,
    }
  })
  return data
}
const page = async() => {
  const session = await requireUser()
  const user = await getUserData(session.user?.id as string)

  if(user?.accountName !== null){
    redirect('/dashboard');
  }
  return (
    <div>
      <Onboarding />
    </div>
  )
}

export default page