import TableContainer from '@/components/Dashboard/TableContainer/TableContainer'
import ProductList from '@/components/Dashboard/Tables/ProductList'
import { cookies } from 'next/headers'

const page = () => {
    cookies()
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <TableContainer
                    heading={"Categories (product types)"}
                    table={<ProductList />}
                />
            </div>
        </>
    )
}

export default page