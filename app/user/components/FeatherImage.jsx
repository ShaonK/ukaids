"use client";

import Image from "next/image";
import React from "react";

export default function FeatherImage({
  src = "/fimage.png",
  alt = "Feature image",
}) {
  return (
    <div className="w-full flex justify-center mt-6">
      <div
        className="relative overflow-hidden"
        style={{
          width: "328px",
          height: "178px",
          borderWidth: "0.7px",
          borderStyle: "solid",
          borderRadius: "7px",
          borderImageSlice: 1,
          borderImageSource:
            "linear-gradient(129.35deg, rgba(216, 147, 73, 0.8) 7.13%, rgba(58, 134, 255, 0.8) 49.34%, rgba(192, 33, 33, 0.8) 93.21%)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={328}
          height={178}
          className="object-cover w-full h-full rounded-[7px]"
          priority
        />
      </div>
    </div>
  );
}
