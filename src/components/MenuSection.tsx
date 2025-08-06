import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MenuItem from "./MenuItem";

interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface MenuSectionProps {
  categories?: {
    id: string;
    name: string;
    items: MenuItemType[];
  }[];
}

const MenuSection = ({ categories = defaultCategories }: MenuSectionProps) => {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id || "wraps",
  );

  return (
    <section id="menu" className="py-12 sm:py-16 px-1 md:px-8 lg:px-16 bg-white">
      <div className="container mx-auto px-1">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-[#EE1C25]">
          Our Menu
        </h2>
        <p className="text-center mb-8 sm:mb-10 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Discover our authentic Mediterranean flavors, made with fresh
          ingredients and traditional recipes.
        </p>

        <Tabs
          defaultValue={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="flex justify-center mb-6 sm:mb-8 bg-[#F5F5F5] p-1 rounded-lg overflow-x-auto overflow-hidden">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg whitespace-nowrap data-[state=active]:bg-[#EE1C25] data-[state=active]:text-white flex-shrink-0"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
                {category.items.map((item) => (
                  <MenuItem
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

// Default menu data
const defaultCategories = [
  {
    id: "wraps",
    name: "Wraps",
    items: [
      {
        id: "chicken-shawarma-wrap",
        name: "Chicken Shawarma Wrap",
        description:
          "Large pita, garlic paste, fries, pickles, pickled turnips, garlic sauce (grilled)",
        price: 12.99,
        image:
          "/images/chicken_shawarma_wrap.jpeg",
      },
      {
        id: "donair-wrap",
        name: "Donair Wrap",
        description:
          "Large pita, lettuce, tomato, onion, sweet sauce and garlic sauce (grilled). Add cheese .75",
        price: 12.99,
        image:
          "/images/donair_wrap.jpeg",
      },
      {
        id: "falafel-wrap",
        name: "Falafel Wrap",
        description:
          "Large pita, lettuce, tomato, parsley, pickle, pickled turnip, tahini sauce",
        price: 11.99,
        image:
          "/images/falafel_wrap.jpeg",
      },
    ],
  },
  {
    id: "platters",
    name: "Platters",
    items: [
      {
        id: "signature-platter",
        name: "Signature Platter",
        description:
          "Rice, fries, your choice of shawarma, donair or mixed topped with our signature garlic sauce",
        price: 19.99,
        image:
          "/images/signature_platter.jpeg",
      },
      {
        id: "regular-platter",
        name: "Platter",
        description:
          "Rice, salad, hummus, chicken, donair, or mixed. Your choice of sauce",
        price: 16.99,
        image:
          "/images/platter.jpeg",
      },
      {
        id: "falafel-platter",
        name: "Falafel Platter",
        description:
          "Salad, hummus, 5 falafel balls, tahini sauce, pita bread",
        price: 15.99,
        image:
          "/images/platter.jpeg",
      },
    ],
  },
  {
    id: "sides",
    name: "Sides & Salads",
    items: [
      {
        id: "large-house-salad",
        name: "Large House Salad",
        description:
          "Fresh mixed greens with Mediterranean vegetables (Add meat for $4)",
        price: 11.99,
        image:
          "/images/side_salad.jpeg",
      },
      {
        id: "side-salad",
        name: "Side Salad",
        description:
          "Smaller portion of our fresh house salad",
        price: 5.99,
        image:
          "/images/side_salad.jpeg",
      },
      {
        id: "side-hummus",
        name: "Side Hummus",
        description:
          "Creamy homemade hummus served with pita",
        price: 4.99,
        image:
          "/images/side_hummus.jpg",
      },
      {
        id: "side-rice",
        name: "Side Rice",
        description:
          "Seasoned Mediterranean rice",
        price: 3.99,
        image:
          "/images/rice.jpg",
      },
      {
        id: "fries",
        name: "Fries",
        description:
          "Golden crispy french fries",
        price: 5.99,
        image:
          "/images/fries.jpeg",
      },
      {
        id: "poutine",
        name: "Poutine",
        description:
          "Classic Canadian poutine with fries, gravy and cheese curds",
        price: 8.99,
        image:
          "/images/poutine.jpeg",
      },
      {
        id: "poutine-deluxe",
        name: "Poutine Deluxe",
        description:
          "Add to your poutine, donair, shawarma or mixed topped with garlic sauce",
        price: 12.99,
        image:
          "/images/poutine_deluxe.jpeg",
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks & Sweets",
    items: [
      {
        id: "can-drink",
        name: "Can Drink",
        description:
          "Assorted soft drinks in cans",
        price: 1.75,
        image:
          "/images/can_drinks.jpg",
      },
      {
        id: "bottle-water",
        name: "Bottle Water",
        description:
          "Fresh bottled water",
        price: 1.75,
        image:
          "/images/bottled_water.webp",
      },
      {
        id: "barbican",
        name: "Barbican",
        description:
          "A popular, non-alcoholic, malt beverage known for its refreshing taste and variety of flavors",
        price: 2.99,
        image:
          "/images/barbican.jpeg",
      }, {
        id: "freez",
        name: "Freez",
        description:
          "A delicious carbonated drink with a variety of natural flavors.",
        price: 2.99,
        image:
          "/images/freez.webp",
      },
      {
        id: "baklava-mix",
        name: "Baklava Mix",
        description:
          "Traditional Middle Eastern pastry with nuts and honey",
        price: 8.99,
        image:
          "/images/baklava_mix.jpg",
      },
    ],
  },
];

export default MenuSection;
