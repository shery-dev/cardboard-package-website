
const DashboardFormContainer = (props) => {
    return (
        <div className=' flex justify-start items-start flex-col gap-4 w-full px-4 py-2 bg-white shadow-sm rounded-lg'>
            <div>
                <h2 className=' text-2xl pb-2 font-medium text-gray-800 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:30%_4px] bg-no-repeat bg-left-bottom'>
                    {props.heading}
                </h2>
            </div>
            <div className=' w-full px-4'>
                {props.component}
            </div>
        </div>
    )
}

export default DashboardFormContainer