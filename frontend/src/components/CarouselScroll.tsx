import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import one from "../assets/one.jpg";
import two from "../assets/two.jpg";
import three from "../assets/three.jpg";
import four from "../assets/four.jpg";
import five from "../assets/five.jpg";
import six from "../assets/six.jpeg";

const CarouselScroll = () => {
  const [images, setImages] = useState([one, two, three]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImages([four, five, six]); // Mobile images
      } else {
        setImages([one, two, three]); // Desktop images
      }
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Listen for resizes

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  return (
    <Carousel>
      {images.map((img, index) => (
        <Carousel.Item key={index}>
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            style={{
              height: "420px",
              width: "100vw",
              objectFit: "cover",
            }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselScroll;
