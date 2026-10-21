'use client'

import { motion } from 'framer-motion'
import { FaCheck } from "react-icons/fa"

const FormContainer = ({ heading, introPara, imgSrc, formComp }) => {
    return (
        <div className="w-full max-w-7xl mx-auto py-4 lg:py-6 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch flex-1 min-h-0">
                {/* Left column: image as background with content on top */}
                <motion.div
                    className="relative min-h-[320px] lg:min-h-0 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-end p-5 sm:p-6 lg:p-8"
                    style={{ backgroundImage: `url(${imgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />
                    <div className="relative z-10">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-lora text-white mb-2 lg:mb-3 drop-shadow-md">
                            {heading}
                        </h1>
                        <p className="text-sm sm:text-base text-white/95 mb-3 font-inter leading-relaxed line-clamp-3 drop-shadow">
                            {introPara}
                        </p>
                        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mb-2">
                            <li className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/25 text-white shrink-0">
                                    <FaCheck className="w-3 h-3" />
                                </span>
                                <span className="text-white font-inter text-sm drop-shadow"><span className="font-semibold">Premium</span> Materials</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/25 text-white shrink-0">
                                    <FaCheck className="w-3 h-3" />
                                </span>
                                <span className="text-white font-inter text-sm drop-shadow"><span className="font-semibold">Custom</span> Designs</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/25 text-white shrink-0">
                                    <FaCheck className="w-3 h-3" />
                                </span>
                                <span className="text-white font-inter text-sm drop-shadow">Delivered in <span className="font-semibold">5 Days</span></span>
                            </li>
                        </ul>
                        <p className="text-white font-lora font-bold text-lg sm:text-xl drop-shadow-md mt-2">
                            Request Your Quote
                        </p>
                    </div>
                </motion.div>

                {/* Right column: form card */}
                <motion.div
                    className="flex flex-col min-w-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-5 overflow-visible">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="h-px flex-1 max-w-[60px] bg-headingTxtColor/40" />
                            <h2 className="text-lg sm:text-xl font-bold text-headingTxtColor font-lora">
                                Request Your Quote
                            </h2>
                            <span className="h-px flex-1 max-w-[60px] bg-headingTxtColor/40" />
                        </div>
                        {formComp}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default FormContainer
