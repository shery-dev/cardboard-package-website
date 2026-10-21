import { Card, Button } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';

function ProductCard(props) {
    return (
        <Card
            className="max-w-xs flex flex-col justify-between"
            imgAlt="img"
            renderImage={() =>
                <Image
                    width={400}
                    height={400}
                    className=' h-62 w-full object-cover'
                    src={props.imgSrc}
                    alt="card image"
                />
            }
        >
            <h5 className="text-2xl font-bold tracking-tight text-headingTxtColor">
                {props.heading}
            </h5>
            <p className="font-normal text-gray-700">
                {props.descriptions}
            </p>
            <Link href={props.to}>
                <Button
                    outline
                    gradientDuoTone="pinkToOrange"
                    className=' w-full'
                >
                    View more
                    <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Button>
            </Link>
        </Card>
    );
}

export default ProductCard