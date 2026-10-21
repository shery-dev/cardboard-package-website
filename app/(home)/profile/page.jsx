import { CheckUser } from '@/components/CheckUser';
import ProfileCard from '@/components/ProfileCard/ProfileCard'
import React from 'react'

const page = async () => {
    const user = await CheckUser();
    return (
        <>
            <div className=' flex justify-between items-center flex-col'>
                <ProfileCard 
                    user={user}
                />
            </div>
        </>
    )
}

export default page