import TableContainer from '@/components/Dashboard/TableContainer/TableContainer'
import ProductsTable from '@/components/Dashboard/Tables/ProductsTable'
import React from 'react'

const page = () => {
    return (
        <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
            <TableContainer
                heading={"Products List"}
                table={<ProductsTable />}
            />
        </div>
    )
}

export default page