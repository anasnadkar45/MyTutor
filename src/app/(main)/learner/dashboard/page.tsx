import { signOut } from '@/app/utils/auth'
import React from 'react'

const page = () => {
  return (
    <div>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}

export default page