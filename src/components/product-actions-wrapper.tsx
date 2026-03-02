"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ProductActions } from "./product-actions";
import { useFormatter } from "@/lib/formatter";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  stockMode: number;
  minimumQuantity?: number;
  maximumQuantity?: number;
}

interface Product {
  id: string;
  name: string;
  game: string;
  basePrice: number;
  variants?: ProductVariant[];
  image: string;
  rating?: number;
  reviews?: number;
  category?: string;
}

interface ProductActionsWrapperProps {
  product: Product;
}

export function ProductActionsWrapper({ product }: ProductActionsWrapperProps) {
  const { formatPrice } = useFormatter();
  // Ensure variants exist and have at least one item
  const variants =
    product.variants && product.variants.length > 0 ? product.variants : [];

  if (variants.length === 0) {
    return (
      <div className="p-6 text-center text-theme-secondary">
        Product currently unavailable
      </div>
    );
  }

  const [currentPrice, setCurrentPrice] = useState(variants[0].price);

  // Default values for optional properties
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  const category = product.category || "Standard";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-theme-secondary font-medium">
            Current Price
          </span>
          <div className="text-3xl font-bold text-accent">
            {formatPrice(currentPrice)}
          </div>
        </div>
      </div>

      <ProductActions
        product={{
          ...product,
          variants,
        }}
        onPriceChange={setCurrentPrice}
      />
    </div>
  );
}
