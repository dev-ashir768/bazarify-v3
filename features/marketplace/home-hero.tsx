"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";

const HomeHero = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <div className="w-full bg-white pt-[130px] md:pt-[90px]">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 md:gap-5">
          {/* Main & Bottom Banner (Left Column) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-0">
            <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              className="w-full relative group"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full aspect-26/9 md:aspect-24/9 overflow-hidden rounded-[14px] md:rounded-[32px] ">
                      <Image
                        src="/images/hero-1.png"
                        alt="Smart Accessories"
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots className="absolute md:bottom-6 bottom-2 left-1/2 -translate-x-1/2 z-10 cursor-pointer" />
            </Carousel>

            <div className="relative w-full aspect-21/4 md:aspect-28/4  overflow-hidden rounded-[14px] md:rounded-[30px] ">
              <Image
                src="/images/hero-3.png"
                alt="Women Body Lotions"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Side Banners (Right Column) */}
          <div className="lg:col-span-4 xl:col-span-3 flex lg:flex-col gap-2 xl:gap-0 pb-2 xl:pb-0">
            <div className="relative w-full  aspect-30/20 lg:flex-1  overflow-hidden rounded-[14px] md:rounded-[32px] ">
              <Image
                src="/images/hero-2.png"
                alt="Smart Watch"
                fill
                className="lg:object-contain object-cover"
              />
            </div>

            <div className="relative w-full aspect-21/4 lg:flex-1  overflow-hidden rounded-[14px] md:rounded-[32px] ">
              <Image
                src="/images/hero-4.png"
                alt="Buds T110"
                fill
                className="lg:object-contain object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
