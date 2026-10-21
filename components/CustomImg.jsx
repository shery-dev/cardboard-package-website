import Image from 'next/image'

const CustomImg = ({ wid, hi, fileName, imgStyle }) => {
    const getImageUrl = (imgName) => `/api/v1/fetchImg/${imgName}`;
    return (
        <>
            <Image
                width={wid}
                height={hi}
                src={getImageUrl(fileName)}
                alt="img"
                className={imgStyle ? imgStyle : ""}
            />
        </>
    )
}

export default CustomImg