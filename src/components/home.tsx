import React, { useState } from "react";
import HeroSection from "./HeroSection";
import MenuSection from "./MenuSection";
import AboutContactSection from "./AboutContactSection";

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="/images/icon.png"
                alt="McDonair Logo"
                className="h-10 w-10 mr-2"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-[#EE1C25] mr-2">
                McDonair & Shawarma
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <a
                href="#home"
                className="text-[#00A651] hover:text-[#EE1C25] transition-colors text-lg"
              >
                Home
              </a>

              <a
                href="#menu" 
                className="text-[#00A651] hover:text-[#EE1C25] transition-colors text-lg"
              >
                Menu
              </a>

              <a
                href="#about"
                className="text-[#00A651] hover:text-[#EE1C25] transition-colors text-lg"
              >
                About
              </a>

              <a
                href="#contact"
                className="text-[#00A651] hover:text-[#EE1C25] transition-colors text-lg"
              >
                Contact
              </a>
            </div>
            
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="https://www.skipthedishes.com/mcdonair-and-shawarma?serviceType=delivery&utm_source=google&utm_medium=organic&utm_campaign=foodorder"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF6B35] text-white px-4 py-2 rounded-md hover:bg-[#E55A2B] transition-colors flex items-center space-x-2"
              >
                <span>Skip the Dishes</span>
              </a>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-[#00A651]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 mt-4">
                <a
                  href="#home"
                  className="text-[#00A651] hover:text-[#EE1C25] transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Home
                </a>
                <a
                  href="#menu"
                  className="text-[#00A651] hover:text-[#EE1C25] transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Menu
                </a>
                <a
                  href="#about"
                  className="text-[#00A651] hover:text-[#EE1C25] transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-[#00A651] hover:text-[#EE1C25] transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Contact
                </a>
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <a
                    href="https://www.skipthedishes.com/mcdonair-and-shawarma?serviceType=delivery&utm_source=google&utm_medium=organic&utm_campaign=foodorder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FF6B35] text-white px-4 py-3 rounded-md hover:bg-[#E55A2B] transition-colors text-center"
                  >
                    Skip the Dishes
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <section id="home">
          <HeroSection />
        </section>

        <section id="menu" className="py-16">
          <MenuSection />
        </section>

        <section id="about">
          <AboutContactSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#00A651] text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">MC Donair & Shawarma</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                Authentic Mediterranean cuisine made with love and tradition.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <a href="#home" className="hover:underline transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:underline transition-colors">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:underline transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact Us</h3>
              <div className="space-y-1 text-sm sm:text-base mb-4">
                <p>B-1000 Nairn Ave</p>
                <p>Winnipeg, Manitoba, Canada</p>
                <p>Phone: (204) 219-4422</p>
                <p>Email: info@mcdonair.com</p>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="font-semibold mb-3 text-sm sm:text-base">Order Online:</p>
                <a
                  href="https://www.skipthedishes.com/mcdonair-and-shawarma?serviceType=delivery&utm_source=google&utm_medium=organic&utm_campaign=foodorder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#FF6B35] text-white px-4 py-2 sm:py-3 rounded-md hover:bg-[#E55A2B] transition-colors text-sm sm:text-base"
                >
                  Skip the Dishes
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20 text-center">
            <p className="text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} Mediterranean Cuisine (MC
              Donair). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
