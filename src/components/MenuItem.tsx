import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

const MenuItem = ({
  name = "Classic Donair",
  description = "Traditional donair with seasoned meat, fresh vegetables, and our signature garlic sauce wrapped in a warm pita.",
  price = 9.99,
  image = "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
  category = "Donairs",
  isPopular = false,
  isVegetarian = false,
  isSpicy = false,
}: MenuItemProps) => {
  return (
    <Card className="w-full max-w-[320px] sm:max-w-[350px] overflow-hidden transition-all hover:shadow-lg bg-white">
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className={`w-full h-full transition-transform hover:scale-105 ${
            category === "drinks" 
              ? "object-contain object-center" 
              : "object-cover object-center"
          }`}
        />
        {isPopular && (
          <Badge
            variant="default"
            className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 text-xs"
          >
            Popular
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2 p-4 sm:p-6">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 flex-1">
            {name}
          </h3>
        </div>
        <div className="flex gap-2 mt-1 flex-wrap">
          {isVegetarian && (
            <Badge
              variant="outline"
              className="text-xs border-green-500 text-green-600"
            >
              Vegetarian
            </Badge>
          )}
          {isSpicy && (
            <Badge
              variant="outline"
              className="text-xs border-red-500 text-red-600"
            >
              Spicy
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-2">
        <div className="w-full text-center">
          <span className="text-lg font-bold text-[#EE1C25]">
            ${price.toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItem;
