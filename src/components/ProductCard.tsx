"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingCart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  category,
  isNew = false,
  isSale = false,
  className,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground",
        )}
      />
    ));
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${id}`}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="rounded bg-green-500 px-2 py-1 text-xs font-medium text-white">
              New
            </span>
          )}
          {isSale && (
            <span className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 opacity-0 transition-all group-hover:opacity-100 hover:bg-white"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardDescription className="mb-1 text-xs tracking-wide uppercase">
              {category}
            </CardDescription>
            <CardTitle className="line-clamp-2 text-base leading-tight">
              <Link
                href={`/products/${id}`}
                className="hover:text-primary transition-colors"
              >
                {name}
              </Link>
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <CardDescription className="mb-3 line-clamp-2 text-sm">
          {description}
        </CardDescription>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <div className="flex">{renderStars(rating)}</div>
          <span className="text-muted-foreground ml-1 text-sm">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-foreground text-lg font-semibold">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-muted-foreground text-sm line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
