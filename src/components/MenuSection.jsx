import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MenuItem from "./MenuItem";
import { Loader2 , LoaderCircle } from "lucide-react";
import { api } from "../components/users/api";


const MenuSection = ({ storeDetails }) => {
  const [mounted, didMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState();
  const categories = [ "Wraps", "Platters", "Sides & Salads", "Drinks & Sweets" ];
  
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id || "Wraps",
  );

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get("/api/menu/all");
      const data = response.data;
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
        console.error("Error fetching menu items:", error);
        throw new Error(error.message);
      } finally {
      didMount(true);
    }

  }

  useEffect(() => {
    if (mounted) {
       setLoading(false);
    }
   }, [mounted]);
  

  if (loading) {
    return (
      <section id="menu" className="py-12 sm:py-16 px-1 md:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-1">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#00A651]/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#00A651] rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-black">  <LoaderCircle className="w-8 h-8 animate-spin" />  </p>
          </div>
        </div>
      </section>
    );
  }

  if (!loading) return (
    <section id="menu" className="py-12 sm:py-16 px-1 md:px-8 lg:px-16 bg-white">
      <div className="container mx-auto px-1">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-black">
          Our Menu
        </h2>
        <p className="text-center mb-8 sm:mb-10 text-black max-w-2xl mx-auto text-sm sm:text-base">
          { storeDetails.our_menu_description }
        </p>

        <Tabs
          defaultValue={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="flex justify-center mb-6 sm:mb-8 bg-[#F5F5F5] p-1 rounded-lg overflow-x-auto overflow-hidden">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg whitespace-nowrap data-[state=active]:bg-[#EE1C25] data-[state=active]:text-white flex-shrink-0"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>


          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
                {menuItems && menuItems.length > 0 ? (
                  menuItems
                    .filter((item) => {
                      // Compare category case-insensitively
                      const itemCategory = item.category?.toString().trim();
                      const tabCategory = category.toString().trim();
                      return itemCategory?.toLowerCase() === tabCategory.toLowerCase();
                    })
                    .map((item) => (
                      <MenuItem
                        key={item.id || item.unique_id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image_key ? `${window.location.origin}/api/images/file/${item.image_key}` : undefined}
                        category={item.category}
                      />
                    ))
                ) : (
                  <p className="text-black col-span-full">No items in this category</p>
                )}
              </div>
            </TabsContent>
          ))}
{/* 
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
                    category={category.id}
                  />
                ))}
              </div>
            </TabsContent>
          ))} */}
        </Tabs>
      </div>
    </section>
  );
};



export default MenuSection;

