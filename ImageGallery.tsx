import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding"
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="mb-4"
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </motion.div>
      ))}
    </Masonry>
  );
}