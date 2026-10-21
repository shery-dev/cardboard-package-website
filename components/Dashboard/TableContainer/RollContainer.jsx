'use client';
import { Button, Label, Radio } from 'flowbite-react'
import React, { useState } from 'react'
import RollsListTable from '../Tables/RollsListTable'
import Link from 'next/link';

const RollContainer = () => {
    const [sizeType, setSizeType] = useState("thick");

    return (
        <div className=' flex flex-col gap-4'>
            <div className=' flex justify-between items-center flex-row'>
                <fieldset className="flex flex-row gap-4">
                    <legend className="mb-4">Roll Type</legend>
                    <div className="flex items-center gap-2">
                        <Radio
                            id="thick"
                            name="sizeType"
                            value="thick"
                            onChange={(e) => setSizeType(e.target.value)}
                            defaultChecked
                        />
                        <Label htmlFor="thick">Thick</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Radio
                            id="thin"
                            name="sizeType"
                            value="thin"
                            onChange={(e) => setSizeType(e.target.value)}
                        />
                        <Label htmlFor="thin">Thin</Label>
                    </div>
                </fieldset>
                <div className=' flex justify-between items-center flex-row gap-2'>
                    <span>
                        <Link
                            href={"/admin/rolls/stockIn-roll"}
                        >
                            <Button outline gradientDuoTone="greenToBlue">
                                Stock In
                            </Button>
                        </Link>
                    </span>
                    <span>
                        <Link
                            href={"/admin/rolls/stockOut-roll"}
                        >
                            <Button outline gradientDuoTone="greenToBlue">
                                Stock Out
                            </Button>
                        </Link>
                    </span>
                </div>
            </div>
            <div>
                <RollsListTable
                    selectedType={sizeType}
                />
            </div>
        </div>
    )
}

export default RollContainer