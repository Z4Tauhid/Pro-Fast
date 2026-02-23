import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      autoFocus
      showThumbs={false}
      className="mt-5"
    >
      <div>
        <img src="/banner1.png" alt="Banner 1" />
      </div>

      <div>
        <img src="/banner2.png" alt="Banner 2" />
      </div>

      <div>
        <img src="/banner3.png" alt="Banner 3" />
      </div>
    </Carousel>
  );
};

export default Banner;
