import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

interface AboutContactSectionProps {
  restaurantStory?: string;
  businessHours?: {
    day: string;
    hours: string;
  }[];
  address?: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
}

const AboutContactSection = ({
  restaurantStory = "Welcome to McDonair & Shawarma, a family-owned business proudly established in 2025.\n\nRooted in tradition and inspired by the rich flavors of Lebanon, our mission is simple: to share authentic Mediterranean cuisine made with love and passed-down family recipes. Every dish—from our signature donairs and shawarmas to other classics—is crafted with fresh ingredients and time-honored techniques.\n\nFrom our kitchen to your table, come taste the difference that family makes.",
  businessHours = [
    { day: "Monday - Saturday", hours: "11:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  address = "B-1000 Nairn Ave Winnipeg, Manitoba, Canada",
  phone = "(204) 219-4422",
  email = "McDonair1000@gmail.com",
  mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2618.5!2d-97.0778!3d49.6687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52ea73f6b2b7e5e3%3A0x1234567890abcdef!2sB-1000%20Nairn%20Ave%2C%20Winnipeg%2C%20MB%2C%20Canada!5e0!3m2!1sen!2sca!4v1620841112082!5m2!1sen!2sca",
}: AboutContactSectionProps) => {
  return (
    <section className="w-full py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* About Section */}
          {/* <div id="ourstory" className="bg-[#f8f4e9] rounded-xl p-6 sm:p-8 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#EE1C25] mb-4 sm:mb-6">
              Our Story
            </h2>
            <div className="relative mb-6 sm:mb-8">
              <img
                src="https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=800&q=80"
                alt="Mediterranean ingredients"
                className="w-full h-40 sm:h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
            </div>
            <div className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed space-y-4">
              {restaurantStory.split('\n\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-4">
              <span className="inline-block w-3 h-3 rounded-full bg-[#EE1C25]"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-[#00A651]"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-white border border-gray-300"></span>
            </div>
          </div> */}

          {/* Contact Section */}
          <div id="contact" className="bg-[#00A651] text-white rounded-xl p-6 sm:p-8 shadow-md w-full md:w-1/2 mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Contact Us</h2>

            {/* Business Hours */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <Clock className="mr-2" size={18} />
                <h3 className="text-lg sm:text-xl font-semibold">Business Hours</h3>
              </div>
              <Card className="bg-white/10 border-none">
                <CardContent className="p-3 sm:p-4">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="font-medium">{schedule.day}</span>
                        <span>{schedule.hours}</span>
                      </div>
                      {index < businessHours.length - 1 && (
                        <Separator className="my-2 bg-white/20" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Location */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <MapPin className="mr-2" size={18} />
                <h3 className="text-lg sm:text-xl font-semibold">Location</h3>
              </div>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">{address}</p>
              <div className="w-full h-40 sm:h-48 rounded-lg overflow-hidden">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Restaurant Location"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="mr-3 flex-shrink-0" size={18} />
                <span className="text-sm sm:text-base">{phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3 flex-shrink-0" size={18} />
                <span className="text-sm sm:text-base break-all">{email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContactSection;
