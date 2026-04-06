"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageFallbackProps extends ImageProps {
  fallbackSrc: string;
}

const ImageFallback = (props: ImageFallbackProps) => {
  const { src, fallbackSrc, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

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
