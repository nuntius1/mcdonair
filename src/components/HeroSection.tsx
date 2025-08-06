import React from "react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  title?: string;
  tagline?: string;
  backgroundImage?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const HeroSection = ({
  title = "McDonair & Shawarma",
  tagline = "Experience authentic Mediterranean flavors in every bite",
  backgroundImage = "/images/hero_image.jpeg",
  buttonText = "Download Menu",
  onButtonClick = () => {
    const link = document.createElement('a');
    link.href = '/images/menu.jpg';
    link.download = 'McDonair-Menu.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
}: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-background">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-8 text-center text-white max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl leading-relaxed">
          {tagline}
        </p>
        <Button
          size="lg"
          className="bg-[#EE1C25] hover:bg-[#CC1821] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
