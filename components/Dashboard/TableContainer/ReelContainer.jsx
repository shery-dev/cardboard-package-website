'use client';
import { Button, Label, Radio } from 'flowbite-react'
import React, { useState } from 'react'
import ReelsListTable from '../Tables/ReelsListTable'
import Link from 'next/link';

const ReelContainer = () => {

    return (
        <div className=' flex flex-col gap-4'>
            <div className=' flex justify-end items-center flex-row'>

                <div className=' flex justify-between items-center flex-row gap-2'>
                    <span>
                        <Link
                            href={"/admin/reels/stockIn-reel"}
                        >
                            <Button outline gradientDuoTone="greenToBlue">
                                Stock In
                            </Button>
                        </Link>
                    </span>
                    <span>
                        <Link
                            href={"/admin/reels/stockOut-reel"}
                        >
                            <Button outline gradientDuoTone="greenToBlue">
                                Stock Out
                            </Button>
                        </Link>
                    </span>
                </div>
            </div>
            <div>
                <ReelsListTable />
            </div>
        </div>
    )
}

export default ReelContainer