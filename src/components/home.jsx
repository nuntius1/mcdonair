import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, NavbarBrand, NavbarToggle, NavbarCollapse, Container } from "react-bootstrap";
import HeroSection from "./HeroSection";
import MenuSection from "./MenuSection";
import AboutContactSection from "./AboutContactSection";
import { api } from "../components/users/api";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeDetails, setStoreDetails] = useState(null);


  useEffect(() => {
    fetchStoreDetails()
  }, []);


  const fetchStoreDetails = async () => {
    const response = await api.get("/api/meta/all-meta/store_details");
    const data = response.data;
    try {
        if (data.success) {
      setStoreDetails(data.data);
     } else {
      console.error("Failed to fetch store details:", data.message);
      throw new Error(data.message);
    } } catch (error) {
        console.error("Error fetching store details:", error);
        throw new Error(error.message);
      } finally { 
        setMounted(true);
      }
  };

  useEffect(() => {
    if (mounted) {
      setIsLoading(false);
    }
  }, [mounted]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.setItem('loggedIn', false);
    
    // Reset auth to guest
    setAuth({
      role: 'guest',
      isLoggedIn: false,
      first_name: null,
      last_name: null,
      email: null,
      accessToken: null,
    });
    
    // Navigate to home page
    navigate('/');
  };


  if (!isLoading && storeDetails) return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navbar expand="lg" className="sticky top-0 z-50 bg-white shadow-md" collapseOnSelect>
        <Container>
          <NavbarBrand className="d-flex align-items-center me-auto">
            <img
              src="/images/icon.png"
              alt="McDonair Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 me-2"
            />
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-black mb-0">
              {storeDetails.short_name}
            </h1>
          </NavbarBrand>

          <NavbarToggle aria-controls="basic-navbar-nav" className="border-0">
            <span className="navbar-toggler-icon"></span>
          </NavbarToggle>

          <NavbarCollapse id="basic-navbar-nav">
            <Nav className="mx-auto mb-2 mb-lg-0">
              <Nav.Link href="#home" className="text-[#EE1C25] hover:text-[#CC1821] px-2 px-lg-3 font-medium">
                Home
              </Nav.Link>
              <Nav.Link href="#menu" className="text-[#EE1C25] hover:text-[#CC1821] px-2 px-lg-3 font-medium">
                Menu
              </Nav.Link>
              <Nav.Link href="#about" className="text-[#EE1C25] hover:text-[#CC1821] px-2 px-lg-3 font-medium">
                About
              </Nav.Link>
              <Nav.Link href="#contact" className="text-[#EE1C25] hover:text-[#CC1821] px-2 px-lg-3 font-medium">
                Contact
              </Nav.Link>
            </Nav>
            <Nav className="ms-lg-auto flex-column flex-lg-row gap-2">
              <a
                href="https://www.skipthedishes.com/mcdonair-and-shawarma?serviceType=delivery&utm_source=google&utm_medium=organic&utm_campaign=foodorder"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#FF6B35] text-white px-3 px-lg-4 py-2 rounded-md hover:bg-[#E55A2B] border-0 text-sm sm:text-base"
              >
                Skip the Dishes
              </a>
              <a
                href="https://www.ubereats.com/ca/store/mcdonair-and-shawarma-1000-nairn-ave/rBv7daWPWqCYq7-Bzf1HBQ?srsltid=AfmBOop98AkgC84dzwyMy6kmrFVJHK92pGD8rkmkle99MmO-4433xv6I"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#00A651] text-black px-3 px-lg-4 py-2 rounded-md hover:bg-green-700 border-0 text-sm sm:text-base"
              >
                Uber Eats
              </a>
              {auth?.isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="btn bg-[#EE1C25] text-white px-3 px-lg-4 py-2 rounded-md hover:bg-[#CC1821] border-0 text-sm sm:text-base"
                >
                  Log out
                </button>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main>
        <section id="home">
          <HeroSection storeDetails={storeDetails} />
        </section>

        <section id="menu" className="py-16">
          <MenuSection storeDetails={storeDetails} />
        </section>

        <section id="about">
          <AboutContactSection storeDetails={storeDetails} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#00A651] text-white py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">  { storeDetails.short_name }</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                 { storeDetails.our_menu_description }
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
                <p>{ storeDetails?.address }</p>
                <p>{ storeDetails?.city }, { storeDetails?.province }, { storeDetails?.country }</p>
                <p>Phone: { storeDetails?.phone }</p>
                <p>Email: { storeDetails?.email }</p>
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

