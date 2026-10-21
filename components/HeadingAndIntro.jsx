const HeadingAndIntro = (props) => {
    return (
        <>
            <div className='flex justify-between items-center flex-col gap-6'>
                <h2 className='text-4xl sm:text-5xl lg:text-6xl text-headingTxtColor font-lora font-bold'>
                    {props.heading}
                </h2>
                <div className=" w-2/3">
                    <p className=' text-center sm:text-lg lg:text-xl text-gray-800 font-inter'>
                        {props.intro}
                    </p>
                </div>
                <div className=" w-3/4 my-2">
                    {props.component}
                </div>
            </div>
        </>
    )
}

export default HeadingAndIntro  