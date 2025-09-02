import ProductCard from "@/components/ProductCard";

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
];

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Discover Amazing Products
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Explore our curated collection of premium products designed to
            enhance your lifestyle with quality and innovation.
          </p>
        </div>

        {/* Featured Products Section */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
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
