import { useState, useRef, useEffect, useCallback } from "react";
import Magnifier from "./Magnifier";
import Image from "next/image";
import { ImageModel } from "./ImageModel";

const ImagesContainer = (props) => {
    const [img, setImg] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setImg(() => (props.img ? props.img[0] : null));
    }, [props]);

    const handlerImgClick = (image, i) => {
        // If the clicked image is already selected, return early
        if (image === img) {
            return;
        }

        setImg(image);
        refs.current[i].classList.add("bg-blue-300");
        for (var j = 0; j < props?.img?.length; j++) {
            if (i !== j) {
                refs.current[j].classList.remove("bg-blue-300");
            }
        }
    };

    const refs = useRef([]);
    const addRefs = useCallback((el) => {
        if (el && !refs.current.includes(el)) {
            refs.current.push(el);
        }
    }, []);

    return (
        <>
            <div className="flex h-1/2">
                <div className="flex flex-col gap-4">
                    {props.img?.map((image, i) => (
                        <div
                            className={i === 0 ? " img_wrap bg-blue-300" : "img_wrap"}
                            key={i}
                            onClick={() => handlerImgClick(image, i)}
                            ref={addRefs}
                        >
                            <Image
                                height={200}
                                width={200}
                                className="w-14 h-14 object-contain"
                                src={image?.startsWith("/") ? image : `/api/v1/fetchImg/${image ?? ""}`}
                                alt="sliderImg"
                            />
                        </div>
                    ))}
                </div>
                <div className="px-2 h-full w-full">
                    {/* <Magnifier smallImageSrc={img} largeImageSrc={img} alt='img' /> */}
                    <Image
                        height={450}
                        width={450}
                        src={img ? (img.startsWith("/") ? img : `/api/v1/fetchImg/${img}`) : ""}
                        alt="selectedImg"
                        className=" cursor-pointer"
                        onClick={() => setOpenModal(true)}
                    />
                </div>
                <ImageModel
                    openVal = {openModal}
                    toggleHandler = {setOpenModal}
                    imgSrc = {img ? (img.startsWith("/") ? img : `/api/v1/fetchImg/${img}`) : ""}
                />
            </div>
        </>
    );
};

export default ImagesContainer;
