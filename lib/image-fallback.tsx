"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageFallbackProps extends ImageProps {
  fallbackSrc: string;
}

const ImageFallback = (props: ImageFallbackProps) => {
  const { src, fallbackSrc, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt || ""}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageFallback;
