'use client';

import { cn } from "@/lib/utils";
import Image from "next/image"
import React from "react"

const ProductImagesPage = ({images} : {images:string[]}) => {
    const [current,setCurrent]  = React.useState(0)
  return (
    <div className="space-y-4">
        <Image src={images[current]} width={1000} height={1000} alt="Product iamge" className="min-h-[300px] object-cover object-center" />
        <div className="flex">
            {images.map((image,index) => (
                    <div key={image} onClick={() => setCurrent(index)} className={ cn("cursor-pointer mr-2 hove:border-orange-600  ")}>
                        <Image src={image} alt="image" width={100} height={100} />

                    </div>
            ))}
        </div>
    </div>
  )
}
export default ProductImagesPage