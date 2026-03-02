"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Star,
  Zap,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { stripMarkdown } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  variantId: string;
}

interface FeaturedProductProps {
  productId: string;
}

export function FeaturedProduct({ productId }: FeaturedProductProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [formatter, setFormatter] = useState<Intl.NumberFormat | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await (globalThis as any).komerza.getStore();
        const formatterInstance = await (
          globalThis as any
        ).komerza.createFormatter();
        setFormatter(formatterInstance);

        if (res.success && res.data) {
          const foundProduct = res.data.products.find(
            (p: any) => p.id === productId
          );

          if (foundProduct) {
            setProduct({
              id: foundProduct.id,
              slug: foundProduct.slug ?? foundProduct.id,
              name: foundProduct.name,
              description:
                stripMarkdown(foundProduct.description) ||
                "Premium executor for enhanced gameplay",
              price: foundProduct.variants[0]?.cost || 0,
              variantId: foundProduct.variants[0]?.id || foundProduct.id,
              image: foundProduct.imageNames[0]
                ? `https://user-generated-content.komerza.com/${foundProduct.imageNames[0]}`
                : "/komerza-logo.png",
            });
          }
        }
      } catch (error) {
        console.error("Failed to load featured product:", error);
      }
    }

    loadProduct();
  }, [productId]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product.id, product.variantId, 1);
  };

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#46CBF8]/5 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#46CBF8]/10 rounded-full blur-[150px]"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#0f0f14] border border-[#46CBF8]/30 rounded-full px-5 py-2.5 text-sm shadow-lg shadow-[#46CBF8]/10">
            <Star className="w-4 h-4 text-[#46CBF8] fill-[#46CBF8] " />
            <span className="text-white font-semibold">FEATURED PRODUCT</span>
            <Badge className="bg-[#46CBF8] text-white text-xs px-2 py-0.5 rounded-full border-0">
              BEST
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#46CBF8]/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative bg-[#0f0f14] border border-white/10 rounded-3xl p-8 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-2xl object-cover"
                />
                {/* Floating badges on image */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-[#0f0f14]/90 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#46CBF8]" />
                    <span className="text-white text-sm font-semibold">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  {product.name}
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-[#46CBF8]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-[#46CBF8]" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    Lightning Fast
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-[#46CBF8]/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-[#46CBF8]" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    Secure & Safe
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-[#46CBF8]/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#46CBF8]" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    Instant Delivery
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-[#46CBF8]/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-[#46CBF8]" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    Top Rated
                  </span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="bg-gradient-to-br from-[#46CBF8]/10 to-purple-500/10 border border-[#46CBF8]/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Price</p>
                    <p className="text-4xl font-black text-white">
                      {formatter?.format(product.price) || `$${product.price}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-3 py-1">
                      IN STOCK
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#46CBF8] hover:bg-[#46CBF8]/90 text-white h-12 rounded-xl font-bold text-base shadow-lg shadow-[#46CBF8]/30 hover:shadow-[#46CBF8]/50 transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Link to={`/products/${product.slug}`} className="flex-1">
                    <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#46CBF8]/50 text-white h-12 rounded-xl font-bold text-base transition-all duration-300">
                      View Details
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
