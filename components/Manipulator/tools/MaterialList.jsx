import { useAppContext } from '@/context/Context'
import KraftTexture from '@/public/kraftTexture.jpg'
import WhiteTexture from '@/public/whiteCoatTexture.jpg'
import DreamcoatTexture from '@/public/dreamCoatTexture.jpg'


import Image from 'next/image'
const MaterialList = () => {
    const { setMaterial, setExtTexImg, setExtTexColor, setSideColors } = useAppContext()

    const materials = [
        {
            name: 'White',
            desc: 'Classic white cardboard with a refined matte finish',
            img: WhiteTexture
        },
        {
            name: 'Dreamcoat',
            desc: 'Classic dreamcoat cardboard with a refined matte finish',
            img: DreamcoatTexture
        },
        {
            name: 'Kraft',
            desc: 'Classic Kraft cardboard with a refined matte finish',
            img: KraftTexture
        }
    ]

    const handleMaterialChange = (matName) => {
        setMaterial(matName)
        if (matName === 'White') {
            setExtTexImg('MailerBoxOuterTex-White.png')
            if (setExtTexColor) setExtTexColor('#FFFFFF')
            if (setSideColors) setSideColors((prev) => ({ ...prev, top: '#FFFFFF', front: '#FFFFFF', lidFront: '#FFFFFF', bottom: '#FFFFFF', back: '#FFFFFF', left: '#FFFFFF', right: '#FFFFFF' }))
        } else if (matName === 'Dreamcoat') {
            setExtTexImg('MailerBoxOuterTex-Dreamcoat.png')
            if (setExtTexColor) setExtTexColor('#FAF5EE')
            if (setSideColors) setSideColors((prev) => ({ ...prev, top: '#FAF5EE', front: '#FAF5EE', lidFront: '#FAF5EE', bottom: '#FAF5EE', back: '#FAF5EE', left: '#FAF5EE', right: '#FAF5EE' }))
        } else {
            setExtTexImg('MailerBoxOuterTex-Kraft.png')
            if (setExtTexColor) setExtTexColor('#C7A882')
            if (setSideColors) setSideColors((prev) => ({ ...prev, top: '#C7A882', front: '#C7A882', lidFront: '#C7A882', bottom: '#C7A882', back: '#C7A882', left: '#C7A882', right: '#C7A882' }))
        }
    }

    return (
        <>
            <ul className=" w-full flex items-start flex-col">
                {
                    materials.map((material) => (
                        <li
                            key={material.name}
                            className=" w-full flex flex-col gap-2 px-2 py-2 border-b border-green-100 hover:bg-green-50 hover:cursor-pointer hover:rounded-t-md border-hover-effect"
                            onClick={() => handleMaterialChange(material.name)}
                        >
                            <span className=" flex justify-start items-center flex-row gap-4">
                                <span>
                                    <Image
                                        height={40}
                                        width={50}
                                        src={material.img}
                                        alt='img'
                                        className=' rounded-md'
                                    />
                                </span>
                                <span className=' text-gray-600 font-bold text-xl'>{material.name}</span>
                            </span>
                            <span className=' text-sm font-medium text-gray-600 text-justify'>
                                {material.desc}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default MaterialList