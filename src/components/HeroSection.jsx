import React from "react";
import { Button } from "./ui/button";
import { getBannerImageUrl } from "@/lib/imageUtils";

const HeroSection = ({ storeDetails }) => {
  const backgroundImage = getBannerImageUrl(storeDetails.banner_img_url);
  const title = storeDetails.short_name;
  const tagline = storeDetails.store_description;
  const buttonText = "See Menu";
  const onButtonClick = () => {
    window.open('/images/menu.jpg', '_blank');
  };
  
  
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] bg-background">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-3 sm:px-6 md:px-8 text-center text-black w-full">
        <div className="bg-[#f8f4e9]/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-[#f8f4e9]/20 w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">
            {title}
          </h1>
          <div className="text-base xs:text-md sm:text-xl md:text-xl mb-4 sm:mb-6 md:mb-8 space-y-2 sm:space-y-3 md:space-y-4">
            {tagline.split('\n\n').map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
          <Button
            size="lg"
            className="bg-[#EE1C25] hover:bg-[#CC1821] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-semibold w-full sm:w-auto"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

