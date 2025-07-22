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
  restaurantStory = "Mediterranean Cuisine (MC Donair) was founded in 2010 with a passion for authentic Mediterranean flavors. Our recipes have been passed down through generations, bringing the taste of the Mediterranean to your neighborhood. We take pride in using only the freshest ingredients and traditional cooking methods to create our signature donairs and other Mediterranean delights.",
  businessHours = [
    { day: "Monday - Thursday", hours: "11:00 AM - 9:00 PM" },
    { day: "Friday - Saturday", hours: "11:00 AM - 10:00 PM" },
    { day: "Sunday", hours: "12:00 PM - 8:00 PM" },
  ],
  address = "123 Mediterranean Ave, Foodville, CA 90210",
  phone = "(555) 123-4567",
  email = "info@mcdonair.com",
  mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.7462606519064!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1620841112082!5m2!1sen!2sus",
}: AboutContactSectionProps) => {
  return (
    <section className="w-full py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* About Section */}
          <div className="bg-[#f8f4e9] rounded-xl p-6 sm:p-8 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#b45a33] mb-4 sm:mb-6">
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
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              {restaurantStory}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span className="inline-block w-3 h-3 rounded-full bg-[#b45a33]"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-[#5c7c54]"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-[#e9c46a]"></span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-[#5c7c54] text-white rounded-xl p-6 sm:p-8 shadow-md">
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
