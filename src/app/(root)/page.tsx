"use client";

import { useCallback, useMemo, useState } from "react";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductFilters, {
  type FilterOptions,
  type FilterState,
} from "@/components/ProductFilters";

const sampleProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and superior sound quality for music lovers.",
    price: 2500000,
    originalPrice: 3000000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    category: "Electronics",
    isNew: false,
    isSale: true,
  },
  {
    id: "2",
    name: "Minimal Desk Setup",
    description:
      "Clean and modern desk setup perfect for productivity and style in your home office workspace.",
    price: 1800000,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    rating: 4.5,
    reviewCount: 89,
    category: "Furniture",
    isNew: true,
    isSale: false,
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    description:
      "Advanced smartwatch with fitness tracking, heart rate monitoring, and seamless smartphone integration.",
    price: 3200000,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.7,
    reviewCount: 203,
    category: "Wearables",
    isNew: false,
    isSale: false,
  },
  {
    id: "4",
    name: "Classic Leather Jacket",
    description:
      "Timeless leather jacket crafted from premium materials, perfect for any casual or formal occasion.",
    price: 1500000,
    originalPrice: 2000000,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    rating: 4.6,
    reviewCount: 156,
    category: "Fashion",
    isNew: false,
    isSale: true,
  },
  {
    id: "5",
    name: "Artisan Coffee Beans",
    description:
      "Premium single-origin coffee beans roasted to perfection, delivering rich flavors and aromatic experience.",
    price: 250000,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
    rating: 4.9,
    reviewCount: 78,
    category: "Food & Beverage",
    isNew: true,
    isSale: false,
  },
  {
    id: "6",
    name: "Ergonomic Office Chair",
    description:
      "Professional ergonomic chair designed for long hours of comfort and support in your workspace.",
    price: 2800000,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    rating: 4.4,
    reviewCount: 92,
    category: "Furniture",
    isNew: false,
    isSale: false,
  },
  {
    id: "7",
    name: "Budget Wireless Earbuds",
    description:
      "Affordable wireless earbuds with decent sound quality for everyday use and basic listening needs.",
    price: 150000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 3.2,
    reviewCount: 45,
    category: "Electronics",
    isNew: false,
    isSale: false,
  },
  {
    id: "8",
    name: "Basic Office Mug",
    description:
      "Simple ceramic mug for coffee or tea, perfect for daily office use with standard capacity.",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
    rating: 3.8,
    reviewCount: 23,
    category: "Food & Beverage",
    isNew: false,
    isSale: false,
  },
];

const filterOptions: FilterOptions = {
  categories: [
    "Electronics",
    "Furniture",
    "Fashion",
    "Food & Beverage",
    "Wearables",
  ],
  priceRanges: [
    { label: "Under IDR 500K", min: 0, max: 500000 },
    { label: "IDR 500K - 1M", min: 500000, max: 1000000 },
    { label: "IDR 1M - 2M", min: 1000000, max: 2000000 },
    { label: "IDR 2M - 5M", min: 2000000, max: 5000000 },
    { label: "Above IDR 5M", min: 5000000 },
  ],
  ratings: [4, 3, 2, 1],
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    priceRange: "",
    rating: "",
    sortBy: "name",
    isNew: false,
    isSale: false,
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...sampleProducts];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category,
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const priceRange = filterOptions.priceRanges.find(
        (range) => range.label === filters.priceRange,
      );
      if (priceRange) {
        filtered = filtered.filter((product) => {
          if (priceRange.max) {
            return (
              product.price >= priceRange.min && product.price <= priceRange.max
            );
          } else {
            return product.price >= priceRange.min;
          }
        });
      }
    }

    // Apply rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    // Apply special filters
    if (filters.isNew) {
      filtered = filtered.filter((product) => product.isNew);
    }
    if (filters.isSale) {
      filtered = filtered.filter((product) => product.isSale);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <Hero />

        {/* Products Section with Filters */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:scrollbar-thin lg:scrollbar-thumb-gray-300 lg:scrollbar-track-gray-100 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                <ProductFilters
                  options={filterOptions}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold">
                      No products found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters to see more products.
                    </p>
                  </div>
                </div>
              )}

              {/* Results Count */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Showing {filteredAndSortedProducts.length} of{" "}
                  {sampleProducts.length} products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Want to see more products?
          </p>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 font-medium transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}
