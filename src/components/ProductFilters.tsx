"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Filter, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

export interface FilterOptions {
  categories: string[];
  priceRanges: { label: string; min: number; max?: number }[];
  ratings: number[];
}

interface ProductFiltersProps {
  options: FilterOptions;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  category: string;
  priceRange: string;
  rating: string;
  sortBy: string;
  isNew: boolean;
  isSale: boolean;
}

const defaultFilters: FilterState = {
  category: "",
  priceRange: "",
  rating: "",
  sortBy: "name",
  isNew: false,
  isSale: false,
};

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest First" },
];

export default function ProductFilters({
  options,
  onFiltersChange,
  className,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Load filters from URL params on mount
  useEffect(() => {
    const urlFilters: FilterState = {
      category: searchParams.get("category") || "",
      priceRange: searchParams.get("priceRange") || "",
      rating: searchParams.get("rating") || "",
      sortBy: searchParams.get("sortBy") || "name",
      isNew: searchParams.get("isNew") === "true",
      isSale: searchParams.get("isSale") === "true",
    };
    setFilters(urlFilters);
    onFiltersChange(urlFilters);
  }, [searchParams]);

  const updateURL = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "" && value !== false) {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : window.location.pathname;

      router.push(newUrl, { scroll: false });
    },
    [router],
  );

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean,
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    router.push(window.location.pathname, { scroll: false });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sortBy") return value !== "name";
    return value && value !== "" && value !== false;
  });

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="mb-6 md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-start"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters {hasActiveFilters && "(Active)"}
          <Filter className="ml-auto h-4 w-4" />
        </Button>
      </div>

      {/* Filters Content */}
      <Card
        className={cn(
          "transition-all duration-300",
          isOpen ? "block" : "hidden md:block",
          className,
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sort By */}
          <div className="space-y-3">
            <h3 className="text-foreground text-sm font-medium tracking-wide uppercase">
              Sort By
            </h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="text-primary border-border focus:ring-primary h-4 w-4 focus:ring-2"
                  />
                  <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-foreground text-sm font-medium tracking-wide uppercase">
              Category
            </h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ""}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="text-primary border-border focus:ring-primary h-4 w-4 focus:ring-2"
                />
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  All Categories
                </span>
              </label>
              {options.categories.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="text-primary border-border focus:ring-primary h-4 w-4 focus:ring-2"
                  />
                  <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="text-foreground text-sm font-medium tracking-wide uppercase">
              Price Range
            </h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="radio"
                  name="priceRange"
                  value=""
                  checked={filters.priceRange === ""}
                  onChange={(e) =>
                    handleFilterChange("priceRange", e.target.value)
                  }
                  className="text-primary border-border focus:ring-primary h-4 w-4 focus:ring-2"
                />
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  All Prices
                </span>
              </label>
              {options.priceRanges.map((range) => (
                <label
                  key={range.label}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.label}
                    checked={filters.priceRange === range.label}
                    onChange={(e) =>
                      handleFilterChange("priceRange", e.target.value)
                    }
                    className="text-primary border-border focus:ring-primary h-4 w-4 focus:ring-2"
                  />
                  <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <h3 className="text-foreground text-sm font-medium tracking-wide uppercase">
              Minimum Rating
            </h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="radio"
                  name="rating"
                  value=""
                  checked={filters.rating === ""}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="text-primary border-border focus:ring-primary h-4 w-4 focus:ring-2"
                />
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  All Ratings
                </span>
              </label>
              {options.ratings.map((rating) => (
                <label
                  key={rating}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={rating.toString()}
                    checked={filters.rating === rating.toString()}
                    onChange={(e) =>
                      handleFilterChange("rating", e.target.value)
                    }
                    className="text-primary border-border focus:ring-primary h-4 w-4 focus:ring-2"
                  />
                  <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {rating}+ Stars
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div className="space-y-3">
            <h3 className="text-foreground text-sm font-medium tracking-wide uppercase">
              Special
            </h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isNew}
                  onChange={(e) =>
                    handleFilterChange("isNew", e.target.checked)
                  }
                  className="text-primary border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
                />
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  New Products
                </span>
              </label>
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isSale}
                  onChange={(e) =>
                    handleFilterChange("isSale", e.target.checked)
                  }
                  className="text-primary border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
                />
                <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  On Sale
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
