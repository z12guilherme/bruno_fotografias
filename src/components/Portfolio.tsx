import Masonry from "react-masonry-css";
import { motion } from "framer-motion";

const portfolioImages = [
  // Substitua pelas URLs das suas imagens. Estas são de exemplo.
  "https://images.unsplash.com/photo-1511285560921-4c92a495f426?w=800",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
  "https://images.unsplash.com/photo-1542838132-350bf6847545?w=800",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
  "https://images.unsplash.com/photo-1597157639079-52413a340b41?w=600",
  "https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=600",
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