import { FaRegQuestionCircle } from "react-icons/fa";

const ToolContainer = ({heading, children}) => {
    return (
        <>
            <div className=" w-full flex justify-start flex-col">
                <div className="px-4 py-1.5 bg-headingTxtColor text-white rounded-t-lg">
                    <div className="text-sm font-semibold text-white flex items-center justify-between flex-row">
                        <span>{heading}</span>
                        <span className=" text-lg font-bold">
                            <FaRegQuestionCircle />
                        </span>
                    </div>
                </div>
                <div className="bg-white p-1.5 rounded-b-lg">
                    {children}
                </div>
            </div>
        </>
    )
}

export default ToolContainer