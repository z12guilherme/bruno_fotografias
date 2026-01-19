import Masonry from "react-masonry-css";
import { motion } from "framer-motion";

import portfolio1 from "@/assets/portfolio1.jpg";
import portfolio2 from "@/assets/portfolio7.jpg";
import portfolio3 from "@/assets/portfolio3.png";
import portfolio4 from "@/assets/portfolio4.jpg";
import portfolio5 from "@/assets/portfolio5.jpg";
import portfolio6 from "@/assets/portfolio6.jpg";



const portfolioImages = [
  portfolio1,
  portfolio2,
  portfolio3,
  portfolio4,
  portfolio5,
  portfolio6,
];

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1,
};

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Portfólio</h2>
        <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto -ml-4" columnClassName="pl-4 bg-clip-padding">
          {portfolioImages.map((image, index) => (
            <motion.div
              key={index}
              className="mb-4"
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={image} alt={`Foto do portfólio ${index + 1}`} className="w-full h-auto rounded-lg shadow-md" />
            </motion.div>
          ))}
        </Masonry>
      </div>
    </section>
  );
};