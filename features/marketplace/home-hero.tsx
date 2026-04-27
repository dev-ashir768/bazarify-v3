"use client";

import { motion} from "framer-motion";
import Image from "next/image";

// ========================= Motion ========================= \\
// const containerVariant: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15,
//       delayChildren: 0.1,
//     },
//   },
// };

// const itemVariant: Variants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
//   },
// };

// const bgLeftVariant: Variants = {
//   hidden: { opacity: 0, x: -30, y: 20 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     y: 0,
//     transition: { duration: 1, ease: [0.25, 0.4, 0.25, 1], delay: 0.3 },
//   },
// };

// const bgRightVariant: Variants = {
//   hidden: { opacity: 0, x: 30, y: 20 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     y: 0,
//     transition: { duration: 1, ease: [0.25, 0.4, 0.25, 1], delay: 0.4 },
//   },
// };

const HomeHero = () => {
  return (
    <section className="w-full bg-white pt-[130px] md:pt-[110px] ">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main & Bottom Banner (Left Column) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-21/9 md:aspect-24/9 overflow-hidden rounded-[20px] md:rounded-[32px] "
            >
              <Image
                src="/images/hero-1.png"
                alt="Smart Accessories"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-full aspect-21/4 md:aspect-28/4  overflow-hidden rounded-[20px] md:rounded-[30px] "
            >
              <Image
                src="/images/hero-3.png"
                alt="Women Body Lotions"
                fill
                className="object-contain"
              />
            </motion.div>
          </div>

          {/* Side Banners (Right Column) */}
          <div className="lg:col-span-4 xl:col-span-3 flex lg:flex-col gap-2 xl:gap-0 pb-2 xl:pb-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative w-full  aspect-30/20 lg:flex-1  overflow-hidden rounded-[5px] md:rounded-[32px] "
            >
              <Image
                src="/images/hero-2.png"
                alt="Smart Watch"
                fill
                className="lg:object-contain object-cover"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative w-full aspect-21/4 lg:flex-1  overflow-hidden rounded-[5px] md:rounded-[30px] "
            >
              <Image
                src="/images/hero-4.png"
                alt="Buds T110"
                fill
                className="lg:object-contain object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
  


export default HomeHero;


