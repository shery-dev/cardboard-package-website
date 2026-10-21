import { useAppContext } from '@/context/Context'
import KraftTexture from '@/public/kraftTexture.jpg'
import WhiteTexture from '@/public/whiteCoatTexture.jpg'
import DreamcoatTexture from '@/public/dreamCoatTexture.jpg'


import Image from 'next/image'
const MaterialList = () => {
    const { setMaterial, setExtTexImg } = useAppContext()

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
        } else if (matName === 'Dreamcoat') {
            setExtTexImg('MailerBoxOuterTex-Dreamcoat.png')
        } else {
            setExtTexImg('MailerBoxOuterTex-Kraft.png')
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