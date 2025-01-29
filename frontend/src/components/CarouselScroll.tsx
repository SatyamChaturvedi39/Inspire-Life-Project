import Carousel from "react-bootstrap/Carousel";
import one from "../assets/one.png";
import two from "../assets/two.png";
import three from "../assets/three.png";

const CarouselScroll = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          src={one}
          alt="First slide"
          style={{ height: "300px", width: "101vw", objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src={two}
          alt="Second slide"
          style={{ height: "300px", width: "101vw", objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src={three}
          alt="Third slide"
          style={{ height: "300px", width: "101vw", objectFit: "cover" }}
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselScroll;
